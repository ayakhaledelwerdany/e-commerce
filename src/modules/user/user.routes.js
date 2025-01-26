import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { updateUserValidation , deleteUserValidation} from "./user.validation.js";
const userRouter = Router()

userRouter.put('/:userId',
    isValid(updateUserValidation),
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(updateUser))

userRouter.delete('/:userId',
    isValid(deleteUserValidation),
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(deleteUser))
// delete user 
// patch : because i update only one thing (soft delete to user)
//userRouter.patch('/',
//    isAuthenticated(),
//    isAuthorized([roles.USER]),
//    asyncHandler()
//)

export default userRouter