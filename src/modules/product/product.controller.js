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
