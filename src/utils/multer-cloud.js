import fs, { mkdirSync } from 'fs'
import path from 'path';
import multer from 'multer';
const { diskStorage } = multer;
import { nanoid } from 'nanoid';

const fileValidation = {
    image: ['image/jpeg', 'image/png'],
    file: ['application/pdf','application/msword'],
    video: ['video/mp4']
}

export const cloudUpload = ({allowType = fileValidation.image})=>{
   const storage =  diskStorage({})
const fileFilter = (req,file,cb)=>{
    if(allowType.includes(file.mimetype)){
        return cb(null , true)
    }
    return cb(new Error('invalid file format',400),false)
}
    return multer({storage, fileFilter})
}
