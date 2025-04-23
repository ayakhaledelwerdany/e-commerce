import { Router } from "express";
import { addSubcategory , updateSubcategory , deleteSubcategory , getAllSubcategories } from "./subcategory.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addSubcategoryValidation,updateSubcategoryValidation ,deleteSubcategoryValidation} from "./subcategory.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const subcategoryRouter = Router()

// add subcategory 
subcategoryRouter.post('/',
isAuthenticated(),
isAuthorized([roles.ADMIN , roles.SELLER]),
fileUpload({folder:'subcategory'}).single('image'),
isValid(addSubcategoryValidation),
asyncHandler(addSubcategory))
// update category 
subcategoryRouter.put('/:id',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]),
    fileUpload({folder:'subcategory'}).single('image'),
    isValid(updateSubcategoryValidation),
    asyncHandler(updateSubcategory)
)
// delete category
subcategoryRouter.delete('/:id',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]),
    isValid(deleteSubcategoryValidation),
    asyncHandler(deleteSubcategory)
)
// get categories 
subcategoryRouter.get('/',asyncHandler(getAllSubcategories)
)
export default subcategoryRouter