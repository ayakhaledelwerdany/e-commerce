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

export const fileUpload = ({folder,allowType = fileValidation.image})=>{
   const storage =  diskStorage({
    destination:(req,file,cb)=>{
        const fullPath = path.resolve(`uploads/${folder}`)
       if(! fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive: true})
       }
        cb(null,`uploads/${folder}`)

    },
    filename:(req,file,cb)=>{
        cb(null,nanoid()+"-"+file.originalname)
    },
})
const fileFilter = (req,file,cb)=>{
    if(allowType.includes(file.mimetype)){
        return cb(null , true)
    }
    return cb(new Error('invalid file format',400),false)
}
    return multer({storage, fileFilter})
}
