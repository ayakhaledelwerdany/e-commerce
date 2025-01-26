import { Cart, Product } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

// add product to cart
export const addToCart = async (req, res, next) => {
    // get data from request
    const { productId, quantity } = req.body;

    // Check existence of product
    const productExist = await Product.findById(productId);
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404));
    }

    // Check if product is in stock
    if (!productExist.inStock(quantity)) {
        return next(new AppError("Out of stock", 400));
    }

    let data = '';

    // Check if product already exists in cart
    const productExistInCart = await Cart.findOneAndUpdate(
        { user: req.authUser._id, "products.productId": productId },
        { "products.$.quantity": quantity },
        { new: true }
    );

    data = productExistInCart;

    // If the product doesn't exist in the cart, add it
    if (!productExistInCart) {
        const addedProduct = await Cart.findOneAndUpdate(
            { user: req.authUser._id },
            { $push: { products: { productId, quantity } } },
            { new: true }
        );
        data = addedProduct;
    }

    // Send response
    return res.status(200).json({
        message: "Added to cart successfully",
        success: true,
        data
    });
};
// delete product from cart
export const deleteProduct = async(req,res, next) =>{
// get data from req
const {productId} = req.params
// check if product exist in cart & update the cart
const productExistInCart = await Cart.findByIdAndUpdate(
    {user: req.authUser._id},
    { $pull: { products: { productId } } }, // Remove product from the cart
    { new: true } // Return updated cart
)
if(!productExistInCart){
    return next(new AppError(messages.product.notFound ,404))
}
// send res
return res.status(200).json({
    message: messages.product.deletedSuccessfully,
    success: true,
    data : Cart
});
}

