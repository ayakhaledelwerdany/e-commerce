import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
import { paymentMethods } from '../../utils/constant/enum.js'
export const createOrderValidation = joi.object({
        phone: joi.string(),
        street: joi.string(),
        paymentMethod: joi.string().valid(...Object.values(paymentMethods)),
        coupon: joi.string(),
})