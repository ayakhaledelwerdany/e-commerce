import slugify from "slugify"
import { Category } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { deleteFile } from "../../utils/file-functions.js"

// add category
export const addCategory = async(req,res,next)=>{
    // get data from req
    let {name} = req.body
    name = name.toLowerCase()
    if(!req.file){
        return next(new AppError(messages.file.isRequired ,400))

    }
    // check existance
    const categoryExist =  await Category.findOne({name})
    if(categoryExist){
        return next(new AppError(messages.category.alreadyExist,409))
    }
    // prepare data
    const slug = slugify(name)
    const category = new Category({
        name,
        slug,
        image : {path: req.file.path },
        createdBy :req.authUser._id,
    })
    const createdCategory = await category.save()
    if(!createdCategory){
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.category.createdSuccessfully,
        success: true,
        data: createdCategory
})
}
// update category
export const updateCategory = async(req,res,next)=>{
    const {name} = req.body
    const {categoryId} = req.params
   const  categoryExist = await Category.findById(categoryId)
   if(!categoryExist)
   {
    return next(new AppError(messages.category.notFound , 404))
   }
   const nameExist = await Category.findOne({name, _id:{ $ne: categoryId}})
   if(nameExist){
    return next(new AppError(messages.category.alreadyExist, 409))
   }
   if(name){
    categoryExist.slug = slugify(name)
   }
    if(req.file){
        deleteFile(categoryExist.image.path)
        categoryExist.image.path = req.file.path
    }
    const updatedCategory = await categoryExist.save()
    if(!updatedCategory){
        return next(new AppError(messages.category.failToUpdate , 500))
    }
    return res.status(200).json({
        message: messages.category.updatedSuccessfully,
        success: true,
        data: updatedCategory
})
}
// get all categories 
export const getAllCategories = async ( req,res,next )=>{
    const categories = await Category.find().populate([{path: "subcategories"}])
    return res.status(200).json({success: true ,
        data: categories
    })

}
// delete category 
export const deleteCategory = async(req,res,next) =>{
    // get data from req
    const {categoryId} = req.params
    // check existance of category & delete
    const categoryExistInCategories = await Category.findByIdAndDelete(categoryId)
    if(!categoryExistInCategories)
        {
         return next(new AppError(messages.category.notFound , 404))
        }
      // Delete associated image file if it exists
    if (categoryExistInCategories.image?.path) {
        deleteFile(categoryExistInCategories.image.path);
    }

    // Respond with success
    return res.status(200).json({
        message: messages.category.deletedSuccessfully,
        success: true,
    });
}