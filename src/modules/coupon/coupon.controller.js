import { Coupon } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { discountTypes } from "../../utils/constant/enum.js"
import { messages } from "../../utils/constant/messages.js"

export const addCoupon = async(req,res,next) =>{
    // get data from request
    const {code, discountAmount, discountType, toDate , fromDate} = req.body
    const userId = req.authUser._id
    // check coupon exist 
    const couponExist = await Coupon.findOne({code})
    if(couponExist){
        return next(new AppError(messages.coupon.alreadyExist , 409))
    }
    // check if percentage
    if(discountType == discountTypes.PERCENTAGE && discountAmount > 100){
        return next(new AppError("Must be less than 100" , 400))
    }
    // prepare data
    const coupon = new Coupon({
        code,
        discountAmount,
        discountType,
        toDate,
        fromDate,
        createdBy : userId,
    })
    // add to database
    const createdCoupon = await coupon.save()
    if(!createdCoupon) {
        return next(new AppError(messages.coupon.failToCreate, 500))
    }
    // send response
    return res.status(201).json({  
        message: messages.coupon.createdSuccessfully,
        success: true,
        data: createdCoupon
    })
}