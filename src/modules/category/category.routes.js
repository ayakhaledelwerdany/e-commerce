import { Router  } from "express";
import { addCategory ,updateCategory,getAllCategories} from "./category.controller.js";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryValidation,updateCategoryValidation } from "./category.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const categoryRouter = Router()

// add category 
categoryRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]),
    fileUpload({folder:'category'}).single('image'),
    isValid(addCategoryValidation),
    asyncHandler(addCategory))

// update category 
categoryRouter.put('/:categoryId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]),
    fileUpload({folder:'category'}).single('image'),
    isValid(updateCategoryValidation),
    asyncHandler(updateCategory)
)
// get categories 
categoryRouter.get('/',asyncHandler(getAllCategories)
)

export default categoryRouter