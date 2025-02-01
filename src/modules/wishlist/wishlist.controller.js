import { User } from "../../../database/index.js"

// add item to wishlist
export const addToWishlist = async (req,res,next) =>{
    // get data from request
    const {productId} = req.params 
    const userId = req.authUser._id
    // add to database
    const updatedUser = await User.findByIdAndUpdate(userId , {$addToSet:{wishList: productId}},{new: true})
    return res.status(200).json({message: "Wish List updated successfully",
        success: true,
        data: updatedUser.wishList
    })
}
// delete item from wishlist
export const deleteItemFromWishlist = async (req,res,next) =>{
    // get data from req
    const {productId} = req.params 
    const userId = req.authUser._id
     // Find user and check if the item exists in their wishlist
     const user = await User.findById(userId);
     if (!user) {
         return next(new AppError("User not found", 404));
     }

     // Check if the item is in the wishlist
     if (!user.wishList.includes(productId)) {
         return next(new AppError("Item not found in wishlist", 400));
     }
    // Remove the product from the wishlist
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $pull: { wishList: productId } }, 
        { new: true }
    );
    // Send response
    return res.status(200).json({
        message: "Item removed from wishlist successfully",
        success: true,
        data: updatedUser.wishList
    });

}