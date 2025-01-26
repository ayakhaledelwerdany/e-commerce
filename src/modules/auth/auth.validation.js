import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signupValidation = joi.object({
    name: generalFields.name.required(),
    email:generalFields.email.required(),
    phone: generalFields.phone.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
    DOB:generalFields.DOB.required()

})
export const loginValidation = joi.object({
    phone: generalFields.phone.when('email',{
        is:joi.exist(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
    email:generalFields.email,
    password: generalFields.password.required(),
})
export const getValidation = joi.object({
    userId: joi.string().required(), 
})
export const updatePassValidation = joi.object({
    userId: joi.string().required(), 
    email:generalFields.email.required(),
    oldPassword:generalFields.password.required(),
    newPassword:generalFields.password.required(),
})
export const resetPassValidation = joi.object({
    email:generalFields.email.required(),
    password: generalFields.password.required(),
    newPassword: generalFields.password.required(),
    otp: generalFields.otp.required()
})