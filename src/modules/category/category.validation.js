import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const addCategoryValidation = joi.object({
    name: generalFields.name.required(),

})
export const updateCategoryValidation = joi.object({
    name: generalFields.name,
    categoryId :generalFields.objectId.required()
})