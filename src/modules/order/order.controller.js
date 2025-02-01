import Stripe from "stripe"
import { Cart, Coupon, Order, Product } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { discountTypes } from "../../utils/constant/enum.js"
import { messages } from "../../utils/constant/messages.js"

// create order
export const createOrder = async(req,res,next) =>{
    // get data from request
    const {phone , street , coupon , paymentMethod } = req.body

    // check coupon
    let couponExist;
    if(coupon){
        couponExist = await Coupon.findOne({code: coupon})
        if(!couponExist){
            return next(new AppError(messages.coupon.notFound , 404))
        }
    }
    // check cart
    const cart = await Cart.findOne({user : req.authUser._id})
    if(!cart){
        return next(new AppError("Cart Not Exist" , 400))
    }
    const products = cart.products
    let orderProducts = [];
    let orderPrice =0;
    
    // check products
    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if(!productExist){
            return next(new AppError(messages.product.notFound , 400))
        }
        if(!productExist.inStock(product.quantity)){
            return  next(new AppError("Out Of Stock", 400))
        }

        // Check and log price and finalPrice values for debugging
        if (typeof productExist.price !== 'number' || typeof productExist.finalPrice !== 'number') {
        console.error(`Invalid product price data for product ID: ${productExist._id}, Name: ${productExist.name}, Price: ${productExist.price}, Final Price: ${productExist.finalPrice}`);
        return next(new AppError("Invalid product price data", 400));
        }
        //finalPrice += orderPrice
        orderProducts.push({
            productId: productExist._id,
            price: productExist.price,
            finalPrice: productExist.finalPrice,
            quantity: product.quantity,
            discount: productExist.discount,
            name: productExist.name
        })
        orderPrice += productExist.finalPrice * product.quantity;
    }
    let finalPrice = orderPrice; // Set initial final price to order price in case there’s no coupon.
    if (couponExist) {
        finalPrice = couponExist.couponType === discountTypes.FIXED_AMOUNT
            ? orderPrice - couponExist.discount
            : orderPrice - (orderPrice * ((couponExist.discount || 0) / 100));
    }
    
    // Ensure finalPrice is not negative
    finalPrice = Math.max(finalPrice, 0);
    
    // create order 
    const order = new Order({
        user : req.authUser._id,
        address:{phone , street},
        coupon: couponExist ?{
            couponId: couponExist._id , 
            code: coupon,
            discount: couponExist.discount
        } : undefined,
        paymentMethod,
        products: orderProducts,
        orderPrice,
        finalPrice,
        })
    // add to database
    const createdOrder = await order.save()
    // integrate payment gateway
    if(paymentMethod == 'Visa'){
        const stripe = new Stripe(process.env.STRIPE_KEY)
        const checkout = await stripe.checkout.sessions.create({
            success_url : "https://www.google.com", // replace this with frontend screens
            cancel_url : "https://www.facebook.come",  // replace this with frontend screens
            payment_method_types : ['card'],
            mode: 'payment',
            metadata:{
                orderId: createdOrder._id.toString()
            },
            line_items : createdOrder.products.map((product)=> {
                return{
                    price_data:{
                        currency:'egp',
                        product_data:{
                            name:product.name
                        },
                        unit_amount: product.price*100
                    },
                    quantity: product.quantity
                }
            })
        })
        return res.status(200).json({
            message: messages.order.createdSuccessfully,
            success: true,
            data: createdOrder,
            url: checkout.url
        })
    }
   // if(!createdOrder){
   //     return next(new AppError(messages.order.failToCreate ,500))
   // }
    return res.status(201).json({
        message: messages.order.createdSuccessfully,
        success: true,
        data: createdOrder
    })
}
// cancel order 
export const cancelOrder = async(req,res,next) =>{
// get data from req
const {orderId} = req.params 
// check existance
const orderExist = await Order.findById(orderId)
if(!orderExist){
    return next(new AppError(messages.order.notFound , 404))
}
// delete order from database
const deletedOrder = await Order.findByIdAndDelete(orderId)
if(!deletedOrder){
    return next(new AppError(messages.order.failToDelete , 500))
}
// send response
return res.status(200).json({
    message: messages.order.deletedSuccessfully,
    success: true
});
}
// get all orders in the database 
const getAllOrders = async(req,res,next) =>{
// fetch all orgers in the database
const orders = await Order.find()
// check existance
if (!orders.length) {
    return next(new AppError(messages.order.notFound, 404));
}
// send response
return res.status(200).json({
    message: messages.order.fetchedSuccessfully,
    success: true,
    data: orders
});
} 