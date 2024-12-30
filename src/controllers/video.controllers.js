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
    if(title==="" || description===""){
        throw new ApiError(400, "Title and description are required")
    }

    //accept and validate thumbnail 
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

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;

    const video=await Video.findById(videoId).lean();
    
    if(!video){
        throw new ApiError(404, "Video not found!!")
    }
    // console.log(video);
    res
    .status(200)
    .json(new ApiResponse(200, video, "Video by Id"))
})

const getAllVideos=asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10, query, sortBy='createdAt', sortType='desc' } = req.query
    const pageNumber=parseInt(page);
    const limitNumber=parseInt(limit);
    const skip=(pageNumber-1)*limitNumber;
    const videos=await Video.find()
        .select('title description videoFile thumbnail duration')
        .sort({sortBy: sortType==='asc'? 1: -1})
        .skip(skip)
        .limit(limitNumber)
        .lean()
        if(!videos){
            throw new ApiError(400, "Videos not available");
        }
        console.log(videos); // Log the video object to inspect its structure
    const totalVideos= await Video.countDocuments();
    return res.status(200).json(new ApiResponse(200, {
        videos,
        total: totalVideos,
        page: pageNumber,
        limit:limitNumber
    }, "Videos retrieved successfully"))
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    
    if (!video) {
        throw new ApiError(404, "Video not available!!"); 
    }

    const { title, description } = req.body;
    if (title === "" || description === "") {
        throw new ApiError(400, "Title and Description both fields are required"); 
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    console.log(thumbnailLocalPath);
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const userId = req.user._id.toString();
    const videoOwner = video.owner.toString();
    // console.log(userId, video.owner);
    if (videoOwner !== userId) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    // Upload thumbnail to Cloudinary
    const thumbnailCloud = await uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnailCloud){
        new ApiError(500, "Cannot update")
    }
    // console.log(thumbnailCloud);

    // Update the video in the database
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                thumbnail: thumbnailCloud.url,
                title: title,
                description: description
            }
        },
        {
            new: true // Return the updated document
        }
    );

    // Return the updated video in the response
    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {uploadVideo, getVideoById, getAllVideos, updateVideoDetails}