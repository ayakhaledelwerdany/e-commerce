import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { signupValidation ,loginValidation} from "./auth.validation.js";
import { signup , verifyAccount, login} from "./auth.controller.js";

export const authRouter = Router()

//signup
authRouter.post('/signup',isValid(signupValidation),asyncHandler(signup) )
authRouter.get('/verify/:token', asyncHandler(verifyAccount))
authRouter.post('/login',isValid(loginValidation), asyncHandler(login))
export default authRouter