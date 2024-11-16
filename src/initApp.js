import bodyParser from 'body-parser';
import { authRouter, brandRouter, categoryRouter ,couponRouter,orderRouter,productRouter,reviewRouer,subcategoryRouter, wishlistRouter} from "./modules/index.js"
import { asyncHandler, globalErrorHandling } from "./middleware/asyncHandler.js"
import cartRouter from "./modules/cart/cart.routes.js"
import { status } from "./utils/constant/enum.js"
import { Cart, Product } from "../database/index.js"
export const initApp = (app, express)=>{
    //parse req
    app.all('*',(req,res,next)=>{
        return res.json({message:"invalid url"})
    })
    app.post('/webhook', bodyParser.raw({type: 'application/json'}), asyncHandler(async (req, res) => {
        const payload = req.body;
        const sig = req.headers['stripe-signature'].toString();
      
        let event = stripe.webhooks.constructEvent(payload, sig, 'whsec_...');
        if (
          event.type === 'checkout.session.completed'
          || event.type === 'checkout.session.async_payment_succeeded'
        ) {
            const checkout = event.data.object;
            const orderId = checkout.metaData.orderId;
            const orderExist = await Order.findByIdAndUpdate(orderId, {status:'Placed'},{new:true})
            await Cart.findOneAndUpdate({usee:orderExist.user}, {products: []},{new:true})
            for (const product of orderExist.products) {
                await Product.findByIdAndUpdate(product.productId , {$inc:{stock: -product.quantity}})
            }
        }
    
        res.status(200).end();
      }));
      
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))
    //routing
    app.use('/category',categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product',productRouter)
    app.use('/auth', authRouter)
    app.use('/review',reviewRouer)
    app.use('/coupon', couponRouter)
    app.use('/wishlist', wishlistRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)

    //global error handling
    app.use(globalErrorHandling)   
}
