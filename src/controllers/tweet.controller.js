import { asyncHandler } from "../utils/asyncHandler.js"
import { upload } from '../middlewares/multer.middleware.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Video } from "../models/video.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const uploadTweet=asyncHandler(async(req,res)=>{
    const {tweetText}=req.body
    if(!tweetText){
        
    }
})

export {uploadTweet}