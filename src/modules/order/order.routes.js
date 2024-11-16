import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderValidation } from "./order.validation.js";
import { createOrder } from "./order.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const orderRouter = Router()

// create order 
orderRouter.post('/',
    isAuthenticated() , 
    isAuthorized(Object.values(roles)),
    isValid(createOrderValidation),
    asyncHandler(createOrder)
    
    
)

export default orderRouter