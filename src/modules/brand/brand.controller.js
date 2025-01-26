import slugify from "slugify"
import { Brand } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import cloudinary from "../../cloud.js"

//add brand
export const addBrand =  async(req,res,next)=> {
// get data from req
let {name} = req.body
name = name.toLowerCase()
// check existance
const brandExist = await Brand.findOne({name})
if(brandExist){
    return next(new AppError(messages.brand.alreadyExist, 409))
}
// prepare object
// upload image 
 const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, 
    {folder:'e_commerce/brand'}  
)
const slug = slugify(name)
const brand = new Brand({
    name,
    slug ,
    logo:{secure_url , public_id} ,
    createdBy : req.authUser._id
    })
// add to db 
const createdBrand = await brand.save()
if(!createdBrand){
    // rollBack
    req.failImage = {secure_url , public_id}
    return next(new AppError(messages.brand.failToCreate, 500))
}
// send response
return res.status(201).json({
    message: messages.brand.createdSuccessfully,
    success: true ,
    data : createdBrand
})
}
// update brand
export const updateBrand = async (req,res,next) =>{
// get data from req
let {name} = req.body
const {brandId} = req.params
name = name.toLowerCase()
// check existance
const brandExist = await Brand.findById(brandId)
if(!brandExist){
    return next(new AppError(messages.brand.notFound, 404))
}
// check name existance
const nameExist = await Brand.findOne({name, _id:{$ne: brandId}})
if (nameExist){
    return next(new AppError(messages.brand.alreadyExist, 409))
}
// prepare data
if(name){
    const slug = slugify(name)
    brandExist.name = name
    brandExist.slug = slug
} 
// upload image
if(req.file){
    // delete old image 
  await cloudinary.uploader.destroy(brandExist.logo.public_id)
    // upload new image
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {
        public_id : brandExist.logo.public_id
    })
    brandExist.logo = {secure_url , public_id}
    req.failImage =  {secure_url , public_id}
}
// update to database
const updateBrand = await brandExist.save()
if(!updateBrand){
    return next( new AppError(messages.brand.failToUpdate, 500))
}
// send res
return res.status(200).json({
    message: messages.brand.updatedSuccessfully,
    success: true,
    data: updateBrand
})
}
// delete brand 
export const deleteBrand = async(req,res,next)=>{
// get data from req 
const {brandId} = req.params
// check existance
const brandExist = await Brand.findById(brandId)
if(!brandExist){
    return next(new AppError(messages.brand.notFound, 404))
}
// Delete the associated image from Cloudinary
if (brandExist.logo && brandExist.logo.public_id) {
    await cloudinary.uploader.destroy(brandExist.logo.public_id);
}
// Delete the brand from the database
const deletedBrand = await Brand.findByIdAndDelete(brandId);
if (!deletedBrand) {
    return next(new AppError(messages.brand.failToDelete, 500));
}
//send response
return res.status(200).json({
    message: messages.brand.deletedSuccessfully,
    success: true,
});
}
// get all brands
export const getAllBrands = async(req,res,next) =>{
// Extract query parameters for pagination and sorting
const { page = 1, limit = 10, sort = "name", order = "asc" } = req.query;

// Convert page and limit to integers
const pageNum = parseInt(page);
const limitNum = parseInt(limit);

// Determine the sorting order
const sortOrder = order === "desc" ? -1 : 1;

// Get the total count of brands
const totalBrands = await Brand.countDocuments();

// Retrieve the brands with pagination and sorting
const brands = await Brand.find()
    .sort({ [sort]: sortOrder })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);
if(!brands){
    return next(new AppError("Failed to retrieve brands" , 500))
}
// Send the response
return res.status(200).json({
    message: "Brands retrieved successfully",
    success: true,
    totalBrands,
    totalPages: Math.ceil(totalBrands / limitNum),
    currentPage: pageNum,
    data: brands,
});
}
