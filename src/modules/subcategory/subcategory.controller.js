import slugify from "slugify"
import path from "path"
import mongoose from 'mongoose';

import { Category, Subcategory } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

//add subcategory
export const addSubcategory = async (req,res,next) =>{
    //get data from req
    let { name, category} = req.body
    name = name.toLowerCase()
      // ✅ Check if category is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(new AppError("Invalid category ID", 400));
    }
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
// update subcategory 
export const updateSubcategory = async( req, res , next ) =>{

    // get data from req
    const { id } = req.params;
    let { name, category } = req.body;

 // Validate subcategory ID
 if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid subcategory ID format", 400));
}

// Convert name to lowercase
if (name) name = name.toLowerCase();

// Find the existing subcategory
const subcategory = await Subcategory.findById(id);
if (!subcategory) {
    return next(new AppError("Subcategory Not Found", 404));
}
// Validate and find category
if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(new AppError("Invalid category ID format", 400));
    }
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
        return next(new AppError("Category Not Found", 404));
    }
}

// Prepare update data
let updateData = { updatedBy: req.authUser._id };
if (name) {
    updateData.name = name;
    updateData.slug = slugify(name, { replacement: "-" });
}
if (category) updateData.category = category;

// Handle image update
if (req.file) {
    if (subcategory.image?.path) {
        await cloudinary.uploader.destroy(subcategory.image.path);
    }
    updateData.image = { path: req.file.path };
}

// Update subcategory
const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, updateData, { new: true });

return res.status(200).json({
    message: "Subcategory updated successfully",
    success: true,
    data: updatedSubcategory,
    });
}
// delete subcategory
export const deleteSubcategory = async (req , res , next) =>{
    // get data from req 
    const { id } = req.params;

        // Check existance
        const subcategory = await Subcategory.findById(id);
        console.log('ID:', req.params.id);
        console.log('Subcategory:', subcategory);
        if (!subcategory) {
            return next(new AppError(messages.subcategory.notFound, 404));
        }

        // Delete the subcategory image from storage if it exists
        if (subcategory.image?.path) {
            await cloudinary.uploader.destroy(subcategory.image.path);
        }

        // Delete the subcategory from the database
        await Subcategory.findByIdAndDelete(id);
        // Send response
        return res.status(200).json({
            message: messages.subcategory.deletedSuccessfully,
            success: true
        });
}
// get all subcategories
export const getAllSubcategories = async (req , res , next) =>{
    // fetch all subcategories from the database
    const subcategories = await Subcategory.find().populate("category", "name");
    // check existance of  subcategories
    if (!subcategories || subcategories.length === 0) {
        return next(new AppError(messages.subcategory.notFound, 404));
    }
    // send response
    return res.status(200).json({
        message: messages.subcategory.fetchedSuccessfully,
        success: true,
        data: subcategories
    });
}