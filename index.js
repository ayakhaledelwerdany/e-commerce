import {scheduleJob} from 'node-schedule'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js'
import categoryRouter from './src/modules/category/category.routes.js'
import { globalErrorHandling } from './src/middleware/asyncHandler.js'
import subcategoryRouter from './src/modules/subcategory/subcategory.routes.js'
import { initApp } from './src/initApp.js'
import { User } from './database/index.js';
import cloudinary from './src/cloud.js';
const app = express()
const port = process.env.port ||3000
dotenv.config({path: path.resolve('./config/.env')})
dbConnect()
initApp(app,express)
scheduleJob('1 2 1 * * *',async() => { 
    const users = await User.find({isDeleted: true , updatedAt: {$lte: Date.now()-3*30*24*60*60*1000}})
    // delete all related image
    let userIds = []
    userIds.push(user._id)
    for (const user of users) {
        await cloudinary.uploader.destroy(user.image.public_id)
    }
    // deleted all related documents
        await User.deleteMany({_id: {$in :userIds}})
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))