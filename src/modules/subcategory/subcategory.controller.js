import slugify from "slugify"
import path from "path"
import { Category, Subcategory } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"


//add subcategory
export const addSubcategory = async (req,res,next) =>{
    //get data from req
    let { name, category} = req.body
    name = name.toLowerCase()
    // check existance
    const categoryExist = await Category.findById(category)
    if(!categoryExist){
        return next(new AppError(messages.category.notFound,404 ))
    }
    const subcategoryExist = await Subcategory.findOne({name})
    if(subcategoryExist){
        return next( new AppError(messages.subcategory.alreadyExist))
    }
    // prepare data
    const slug = slugify(name, {replacement: "-"})
    const subcategory = new Subcategory({
        name,
        slug,
        image:{path: req.file?.path},
        category,
        createdBy :req.authUser._id,
    })
    const createdSubcategory =await subcategory.save()
    if(!createdSubcategory){
        return next( new AppError(messages.subcategory.failToCreate,500))
    }
    // send response
    return res.status(201).json({message: messages.subcategory.createdSubcategory,
        success: true,
        data: createdSubcategory
    })
}