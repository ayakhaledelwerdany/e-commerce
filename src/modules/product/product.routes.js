import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addProduct , deleteProduct, getAllProducts, updateProduct } from "./product.controller.js";
import { addProductValidation, updateProductValidation } from "./product.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const productRouter = Router()

// add product 
productRouter.post('/',
isAuthenticated(),
isAuthorized([roles.ADMIN , roles.SELLER]),
cloudUpload({}).fields([{name: 'mainImage', maxCount: 1},{name: 'subImages', maxCount:5}]),
isValid(addProductValidation),
asyncHandler(addProduct)
)
// get all products
productRouter.get('/', asyncHandler(getAllProducts))
// update product 
productRouter.put('/:productId',
isAuthenticated(),
isAuthorized([roles.ADMIN , roles.SELLER]),
cloudUpload({}).fields([{name: 'mainImage', maxCount: 1},{name: 'subImages', maxCount:5}]),
isValid(updateProductValidation),
asyncHandler(updateProduct)
)
productRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]),
    asyncHandler(deleteProduct)
    )
export default productRouter
