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
export const deleteSubcategory = async (req , res , next) =>{
    // get data from req 
    const { id } = req.params;

        // Check existance
        const subcategory = await Subcategory.findById(id);
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
// update subcategory 
export const updateSubcategory = async( req, res , next ) =>{
    // get data from req
    const { id } = req.params;
    let { name, category } = req.body;
    // Convert name to lowercase
    if (name) {
        name = name.toLowerCase();
    }
    // Check if the subcategory exists
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
        return next(new AppError(messages.subcategory.notFound, 404));
    }
    // Check if the new name already exists
    if (name && name !== subcategory.name) {
        const subcategoryExist = await Subcategory.findOne({ name });
        if (subcategoryExist) {
            return next(new AppError(messages.subcategory.alreadyExist, 400));
        }
    }
    // Check if the category exists
    if (category) {
        const categoryExist = await Category.findById(category);
        if (!categoryExist) {
            return next(new AppError(messages.category.notFound, 404));
        }
    }
    // Update the slug if the name has changed
    if (name) {
        subcategory.slug = slugify(name, { replacement: "-" });
        subcategory.name = name;
    }

    // Update category if provided
    if (category) {
        subcategory.category = category;
    }
    // Handle image update if a new image is uploaded
    if (req.file) {
        // Delete the old image from Cloudinary
        if (subcategory.image?.path) {
            await cloudinary.uploader.destroy(subcategory.image.path);
        }

        // Upload the new image
        subcategory.image = { path: req.file.path };
    }
    // Save the updated subcategory
    subcategory.updatedBy = req.authUser._id;
    const updatedSubcategory = await subcategory.save();
    // Send response
    return res.status(200).json({
        message: messages.subcategory.updatedSuccessfully,
        success: true,
        data: updatedSubcategory
    });
}