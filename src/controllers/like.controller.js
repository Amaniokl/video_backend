import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike= asyncHandler(async (req,res)=>{
    const {videoId}= req.params
    if(!videoId){
        throw new ApiError(400, "Video is not valid")
    }
    const findVideo=Video.findById
})