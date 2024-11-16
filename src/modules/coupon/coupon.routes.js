import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponValidation } from "./coupon.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCoupon } from "./coupon.controller.js";
const couponRouter = Router()
// add coupon 
couponRouter.post('/',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN]),
    isValid(addCouponValidation),
    asyncHandler(addCoupon)
)

export default couponRouter