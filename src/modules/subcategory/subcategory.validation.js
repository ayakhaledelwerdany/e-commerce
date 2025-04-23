import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addSubcategoryValidation = joi.object({
    name: generalFields.name.required(),
    category : generalFields.objectId.required()

})
export const updateSubcategoryValidation = joi.object({
    name: generalFields.name,
    categoryId :generalFields.objectId.required(),

})
export const deleteSubcategoryValidation = {
    params: joi.object({
      id: generalFields.objectId.required()
    })
  }