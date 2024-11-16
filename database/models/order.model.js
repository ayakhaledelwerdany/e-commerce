import { model, Schema } from "mongoose";
import { orderStatus, paymentMethods } from "../../src/utils/constant/enum.js";

// schema 
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    products:[{
        productId :{
            type: Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:{
            type: Number,
            default:1
        },
        name: String,
        price: Number,
        finalPrice: Number,
        discount: Number,
    }],
    address:{
        phone: String,
        street: String
    },
    paymentMethod:
       { 
        type: String,
        enum : Object.values(paymentMethods),
        default: paymentMethods.CASH
    },
    status:{
        type: String,
        enum : Object.values(orderStatus),
        default: orderStatus.PLACED,
    },
    coupon:{
        couponId:{
            type: Schema.Types.ObjectId,
            ref: "Coupon",
        },
        code: String,
        discount: Number
    },
    orderPrice: Number,
    finalPrice: Number,
},{
    timestamps: true,
})
// model
export const Order = model('Order', orderSchema)