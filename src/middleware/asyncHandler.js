import fs from 'fs'
import { AppError } from '../utils/appError.js'
import path from 'path'
import { deleteFile } from '../utils/file-functions.js'
import { deleteCloudImage } from '../cloud.js'
export const asyncHandler = (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch((err)=>{
            return next (new AppError(err.message , err.statusCode))
        })
    }
}
export const globalErrorHandling = async (err,req,res,next)=>{
    // rollback file system
    if(req.file){
        deleteFile(req.file.path)
    }
    //rollback cloud
    if(req.failImage){
       await deleteCloudImage(req.failImage.puplic_id)
    }
    if(req.failImage?.length > 0){
        for (const public_id of req.failImage) {
            await deleteCloudImage(public_id)
        }
    }
    return res.status(err.statusCode || 500).json({message: err.message , success: false })
}