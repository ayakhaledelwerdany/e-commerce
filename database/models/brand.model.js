import { model, Schema } from "mongoose";

//schema 
export const brandSchema = new Schema({

    name:{
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true  
    },
    logo:{
        secure_url:{
            type: String,
            required: true,
        },
        public_id:{
            type: String,
            required: true,
        },
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
},
{
    timestamps: true
})
//model 
export const Brand = model('Brand', brandSchema)