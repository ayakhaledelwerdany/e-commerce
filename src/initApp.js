import { authRouter, brandRouter, categoryRouter ,couponRouter,orderRouter,productRouter,reviewRouer,subcategoryRouter, wishlistRouter} from "./modules/index.js"
import { globalErrorHandling } from "./middleware/asyncHandler.js"
import cartRouter from "./modules/cart/cart.routes.js"
export const initApp = (app, express)=>{
    //parse req
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))
    //routing
    app.use('/category',categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/product',productRouter)
    app.use('/auth', authRouter)
    app.use('/review',reviewRouer)
    app.use('/coupon', couponRouter)
    app.use('/wishlist', wishlistRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)

    //global error handling
    app.use(globalErrorHandling)   
}
