import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderValidation } from "./order.validation.js";
import { cancelOrder, createOrder, getAllOrders } from "./order.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const orderRouter = Router()

// create order 
orderRouter.post('/',
    isAuthenticated() , 
    isAuthorized(Object.values(roles)),
    isValid(createOrderValidation),
    asyncHandler(createOrder)
)
// cancel order
orderRouter.delete('/:orderId',
    isAuthenticated() , 
    isAuthorized(Object.values(roles)),
    asyncHandler(cancelOrder)
)
// get all orders in the database 
orderRouter.get('/',
    asyncHandler(getAllOrders)
)

export default orderRouter