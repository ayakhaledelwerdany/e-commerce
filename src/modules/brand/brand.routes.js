import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addBrandValidation , updateBrandValidation , deleteBrandValidation } from "./brand.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addBrand ,deleteBrand,updateBrand , getAllBrands} from "./brand.controller.js";
import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
const brandRouter = Router()
// add brand 
brandRouter.post('/',
isAuthenticated(),
isAuthorized([roles.ADMIN , roles.SELLER]),
cloudUpload({}).single('logo'), 
isValid(addBrandValidation),
asyncHandler(addBrand)
),
// update brand 
brandRouter.put('/:brandId', 
isAuthenticated(),
isAuthorized([roles.ADMIN , roles.SELLER]),
cloudUpload({}).single('logo'), 
isValid(updateBrandValidation),
asyncHandler(updateBrand)
)
// delete brand 
brandRouter.delete('/:brandId', 
    isAuthenticated(),
    isAuthorized([roles.ADMIN , roles.SELLER]), 
    isValid(deleteBrandValidation),
    asyncHandler(deleteBrand)
)
// get All Brands
brandRouter.get('/',asyncHandler(getAllBrands)
)
export default brandRouter