import { asyncHandler } from "../utils/asyncHandler.js"
import { upload } from '../middlewares/multer.middleware.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Video } from "../models/video.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const uploadVideo= asyncHandler(async(req,res)=>{
    console.log(req.user._id)
    //accept title and description and validate
    const {title, description}=req.body
    if(title==="" || !description===""){
        throw new ApiError(400, "Title and description are required")
    }

    //accept and check thumbnail 
    const thumbnailLocalPath = await req.files?.thumbnail[0]?.path;
    console.log(thumbnailLocalPath)
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
    }

    //accept the path of video from the body
    const videoLocalPath = req.files?.video[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400, "Video is required")
    }

    //upload the video and thumbnail on cloudinary
    const video = await uploadOnCloudinary(videoLocalPath)
    if(!video || !video.url){
        throw new ApiError(500, "Error while uploading the file")
    }

    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail || !thumbnail.url){
        throw new ApiError(500, "Error while uploading")
    }

    // console.log(video)
    //save the url in the data base
    const newVideo=await Video.create({
        title: title,
        description: description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner:req.user._id,
        duration: video.duration
    })

    return res.status(200).json(
        new ApiResponse(200, newVideo, "Video uploaded successfully")
    )
})

export {uploadVideo}