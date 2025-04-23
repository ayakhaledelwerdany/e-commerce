import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addToCart , deleteProduct } from "./cart.controller.js";

const cartRouter = Router()
// add to cart
cartRouter.put('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(addToCart)
)
// delete product from cart
cartRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(deleteProduct)
) //todo
export default cartRouter