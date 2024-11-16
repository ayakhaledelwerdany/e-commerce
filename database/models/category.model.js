import { model, Schema } from "mongoose";
import { Subcategory } from "./subcategory.model.js";

//schema
const categorySchema = new Schema({
    name: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true, // remove spaces from the start and  the end of the word
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true, 
    },
    image:{
        type: Object,   
        required:true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
},
{
timestamps:true,
toJSON:{virtuals: true}
})
categorySchema.virtual('subcategories',{
    ref: "Subcategory",
    localField :"_id",
    foreignField:"category"
})
//model
export const Category = model('Category', categorySchema)