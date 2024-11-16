import { Schema , model} from "mongoose";

//schema
const reviewSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    comment:String,
    rate:{
        type: Number,
        min: 0,
        max: 5,
    },
    isVerified: Boolean

},
    {
    timestamps: true
})
//model
export const Review = model('Review', reviewSchema)