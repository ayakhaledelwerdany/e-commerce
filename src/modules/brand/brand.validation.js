import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addBrandValidation = joi.object({
    name: generalFields.name.required(),

})
export const updateBrandValidation = joi.object({
    name : generalFields.name,
    brandId : generalFields.objectId.required()
})
export const deleteBrandValidation = joi.object({
    name : generalFields.name,
    brandId : generalFields.objectId.required()
})