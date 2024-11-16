import path from 'path'
import express from 'express'
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js'
import categoryRouter from './src/modules/category/category.routes.js'
import { globalErrorHandling } from './src/middleware/asyncHandler.js'
import subcategoryRouter from './src/modules/subcategory/subcategory.routes.js'
import { initApp } from './src/initApp.js'
app.all('*',(req,res,next)=>{
    return res.json({message:"invalid url"})
})
const app = express()
const port = process.env.port ||3000
dotenv.config({path: path.resolve('./config/.env')})
dbConnect()
initApp(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))