import { Coupon } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { discountTypes } from "../../utils/constant/enum.js"
import { messages } from "../../utils/constant/messages.js"

// create new coupon
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
// get all coupons in the system
export const getAllCoupons = async(req,res,next) =>{
// fetch all coupons from the database
const coupons = await Coupon.find()
if(!coupons.length){
    return next(AppError("no coupons available"))
}
// send res
return res.status(200).json({  
    message: "Coupons retrieved successfully",
    success: true,
    data: coupons
})
}
// update coupon
export const updateCoupon = async(req,res,next) =>{
// get data from req 
const { couponId } = req.params;
const { code, discountAmount, discountType, toDate, fromDate } = req.body;
// check existance 
const coupon =  await Coupon.findById(couponId)
if (!coupon) {
    return next(new AppError(messages.coupon.notFound, 404));
}
// check for duplicate code if code is being updated
if (code && code !== coupon.code) {
    const codeExists = await Coupon.findOne({ code });
    if (codeExists) {
        return next(new AppError(messages.coupon.alreadyExist, 409));
    }
}
// validate percentage discount type
if (discountType === discountTypes.PERCENTAGE && discountAmount > 100) {
    return next(new AppError("Discount percentage must be less than or equal to 100", 400));
}

// update fields
if (code) coupon.code = code;
if (discountAmount) coupon.discountAmount = discountAmount;
if (discountType) coupon.discountType = discountType;
if (toDate) coupon.toDate = toDate;
if (fromDate) coupon.fromDate = fromDate;

// save updated coupon to database
const updatedCoupon = await coupon.save();
    if (!updatedCoupon) {
        return next(new AppError(messages.coupon.failToUpdate, 500));
    }
    // send response
    return res.status(200).json({
        message: messages.coupon.updatedSuccessfully,
        success: true,
        data: updatedCoupon,
    });
}
// delete coupon
export const deleteCoupon = async(req,res,next) =>{
// get data from req
const {couponId} = req.params
// check existance
const coupon =  await Coupon.findById(couponId)
if (!coupon) {
    return next(new AppError(messages.coupon.notFound, 404));
}
// delete the coupon
const deletedCoupon = await Coupon.deleteOne()
if(!deletedCoupon){
    return next (new AppError(messages.coupon.failToDelete, 500))
}
 // send response
 return res.status(200).json({
    message: messages.coupon.deletedSuccessfully,
    success: true,
    data: deletedCoupon,
});
    
}