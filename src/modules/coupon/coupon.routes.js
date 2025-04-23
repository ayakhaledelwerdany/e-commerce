import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponValidation } from "./coupon.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCoupon, deleteCoupon, getAllCoupons, updateCoupon } from "./coupon.controller.js";
const couponRouter = Router()
// add coupon 
couponRouter.post('/',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN]),
    isValid(addCouponValidation),
    asyncHandler(addCoupon)
)
// update coupon 
couponRouter.put('/:couponId',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN]),
    isValid(addCouponValidation),
    asyncHandler(updateCoupon)
)
// delete coupon 
couponRouter.delete('/:couponId',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteCoupon)
)
// get all coupons
couponRouter.get('/',
    isAuthenticated(),  
    isAuthorized([roles.ADMIN]),
    asyncHandler(getAllCoupons)
)
export default couponRouter