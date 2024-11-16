import { User } from "../../../database/index.js"

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