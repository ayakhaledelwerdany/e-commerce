import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addReview } from "./review.controller.js";

const reviewRouer = Router()
// add review
reviewRouer.post('/:productId',
    isAuthenticated(), 
    isAuthorized([roles.USER, roles.ADMIN]),
    //validation
    asyncHandler(addReview)
)
export default reviewRouer