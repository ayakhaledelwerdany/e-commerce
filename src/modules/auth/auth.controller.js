import bcrypt, { hashSync } from 'bcrypt'
import { Cart, User } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { sendEmail } from '../../utils/email.js'
import { generateToken, verifyToken } from '../../utils/token.js'
import { status } from '../../utils/constant/enum.js'

export const signup = async(req,res,next)=>{
    // get data from req
    let {name, email , password , phone } = req.body
    // check existance
    const userExist = await User.findOne({$or: [{email},{phone}]})
    if(userExist){
        return next(new AppError(messages.user.alreadyExist ,409))
    }
    // prepare data
    password = bcrypt.hashSync(password,8)
    const user = new User({
        name,
        email,
        password,
        phone
    })
    // add to database
    const createdUser = await user.save()
    if(!createdUser){
        return next(new AppError(messages.user.failToCreate ,500))
    }
    // generate token
   const token =  generateToken({payload:{email , _id : createdUser._id} })
    // send email
    sendEmail({
        to: email ,
        subject:"verify your account" , 
        html :`<p>to verify your account click <a href='${req.protocol}://${req.headers.host}/auth/verify/${token}'>link</a></p>`})
     
    // send response
    return res.status(201).json({
        message: messages.user.createdSuccessfully,
        success: true,
        data: createdUser
    })

}
export const verifyAccount = async(req,res,next) =>{
    //get data from request
        const {token} = req.params
        const payload = verifyToken({token})
        await User.findOneAndUpdate({email:payload.email, status: "Pending"},{status:"Verified"})
        await Cart.create({user: payload._id , products: []})
        return res.status(200).json({
            message: "User Verified Successfully",
            success: true,
        })      
}

export const login = async(req,res,next)=>{
    //get data from req
    const {email , phone , password} = req.body
    // check existanse
    const userExist = await User.findOne({$or : [{email} , {phone}], status: "Verified"})
    if(!userExist){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // check password
    const match = bcrypt.compareSync(password , userExist.password)
    if(!match){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // generate token
    const token = generateToken({payload:{_id: userExist._id , email}})
    // send response
    return res.status(200).json({
        message: "Login Successfully", 
        success: true ,
        token
    })
}
   