import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToWishlist, deleteItemFromWishlist } from "./wishlist.controller.js";

const wishlistRouter = Router()

// add to wishlist
wishlistRouter.post('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER , roles.ADMIN]),
    asyncHandler(addToWishlist)
)
// delete from wishlist
wishlistRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER , roles.ADMIN]),
    asyncHandler(deleteItemFromWishlist)
)

export default wishlistRouter