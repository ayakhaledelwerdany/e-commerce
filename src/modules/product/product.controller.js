import slugify from 'slugify'
import {Brand, Product, Subcategory} from '../../../database/index.js'
import { AppError } from '../../utils/appError.js'
import { messages } from '../../utils/constant/messages.js'
import cloudinary from '../../cloud.js'
import { ApiFeatures } from '../../utils/apiFeatures.js'

// add product
export const addProduct = async(req,res,next) =>{
    // get data from req
    const {name,description,stock,price,discount,discountType,colors,sizes,brand,category,subcategory} = req.body
    // check existance
    // 1- brand exist 
    const brandExist = await Brand.findById(brand)
    if(!brandExist){
        return next(new AppError(messages.brand.notFound , 404))
    }
    // 2- subcategory
    const subcategoryExist = await Subcategory.findById(subcategory)
    if(!subcategoryExist){
        return next(new AppError(messages.subcategory.notFound , 404))
    }
    // upload images 
    // req.files >>> {mainImage:[{}] , subImages:[{},{},{},{},{}]}
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path, {folder: 'e_commerce/products/mainImages'})
    let mainImage = {secure_url , public_id}
    req.failImage = []
    failImage.push(public_id)
    let subImages = []
   for(const file of req.files.subImages){
    const {secure_url , public_id} = await cloudinary.uploader.upload(file.path , {folder: "e_commerce/products/subImages"})
    subImages.push({secure_url , public_id})
    req.failImage.push(public_id)
   }

    // prepare data
    const slug = slugify(name)
    const product = new Product({
        name,slug,description,stock,price,discount,discountType,colors:JSON.parse(colors),sizes:JSON.parse(sizes),brand,category,subcategory,mainImage,subImages,
        createdBy : req.authUser._id,
        updatedBy:  req.authUser._id,
    })
    // add to database
    const createdProduct = await product.save()
    if(!createdProduct){
        return next(new AppError(messages.product.failToCreate ,500))
    }
    // send response
    return res.status(201).json({
        message: messages.product.createdSuccessfully,
        success: true,
        data: createdProduct
    })
}
// get All Products (pagination , sort , select , filter)
export const getAllProducts = async(req,res,next) =>{
    let {page , size , sort , select , ...filter} = req.query 
    const apiFeature = new ApiFeatures(Product.find(), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    return res.status(200).json({
        success: true ,
        data : products
    })
}
// update product 
export const updateProduct = async(req, res,next) =>{
// get product ID from request params
const { productId } = req.params;
// get updated data from request
const { name, description, stock, price, discount, discountType, colors, sizes, brand, category, subcategory } = req.body;
 // check product existance
 const product = await Product.findById(productId);
 if (!product) {
    return next(new AppError(messages.product.notFound, 404));
}
// check brand existence
if (brand) {
    const brandExist = await Brand.findById(brand);
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404));
    }
}
// check subcategory existence
if (subcategory) {
    const subcategoryExist = await Subcategory.findById(subcategory);
    if (!subcategoryExist) {
        return next(new AppError(messages.subcategory.notFound, 404));
    }
}
// update images if provided
let mainImage = product.mainImage;
let subImages = product.subImages;
if (req.files?.mainImage) {
    // delete old main image from cloudinary
    await cloudinary.uploader.destroy(product.mainImage.public_id);

    // upload new main image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: "e_commerce/products/mainImages" });
    mainImage = { secure_url, public_id };
}
if (req.files?.subImages) {
    // delete old sub images from cloudinary
    for (const img of product.subImages) {
        await cloudinary.uploader.destroy(img.public_id);
    }
    // upload new sub images
    subImages = [];
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "e_commerce/products/subImages" });
        subImages.push({ secure_url, public_id });
    }
}
// update product fields
product.name = name || product.name;
product.slug = name ? slugify(name) : product.slug;
product.description = description || product.description;
product.stock = stock ?? product.stock;
product.price = price ?? product.price;
product.discount = discount ?? product.discount;
product.discountType = discountType ?? product.discountType;
product.colors = colors ? JSON.parse(colors) : product.colors;
product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
product.brand = brand || product.brand;
product.category = category || product.category;
product.subcategory = subcategory || product.subcategory;
product.mainImage = mainImage;
product.subImages = subImages;
product.updatedBy = req.authUser._id;

 // save updated product
const updatedProduct = await product.save();
if (!updatedProduct) {
    return next(new AppError(messages.product.failToUpdate, 500));
}

 // send response
return res.status(200).json({
     message: messages.product.updatedSuccessfully,
     success: true,
     data: updatedProduct
 });
}
//delete product
export const deleteProduct = async(req,res,next) =>{
// get data from req
const { productId } = req.params;
// check existance of product
const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError(messages.product.notFound, 404));
    }
// delete main image from Cloudinary
await cloudinary.uploader.destroy(product.mainImage.public_id);

// delete sub-images from Cloudinary
for (const img of product.subImages) {
    await cloudinary.uploader.destroy(img.public_id);
}
// delete product from database
const deletedProduct = await Product.findByIdAndDelete(productId);
if (!deletedProduct) {
    return next(new AppError(messages.product.failToDelete, 500));
}
// send response
return res.status(200).json({
    message: messages.product.deletedSuccessfully,
    success: true
});
}
