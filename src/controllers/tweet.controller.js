import { asyncHandler } from "../utils/asyncHandler.js"
import { upload } from '../middlewares/multer.middleware.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Tweet } from "../models/tweet.model.js"

const uploadTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const user = req.user._id;
    console.log(req.body);
    console.log(content);

    if (!content) {
        throw new ApiError(400, "Write some text to tweet");
    }

    const newTweet = await Tweet.create({
        content: content,
        owner: user
    });

    res.status(200).json(new ApiResponse(200, newTweet, "Tweet uploaded successfully!!"));
});

const deleteTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const deleted=await Tweet.findByIdAndDelete(tweetId)
    res.status(200).json(new ApiResponse(200, deleted, "Tweet deleted"))
})

const getAllTweet=asyncHandler(async(req,res)=>{
    // get userId
    // check if it exist
    // get all tweets of this user
    // return the tweets
    const userId = req.params?.userId
    if (!userId) {
        throw new ApiError(400,"Invalid UserId")
    }

    const tweet = await Tweet.find({owner:userId})
    
    if (tweet.length === 0 ) {
        throw new ApiError(404,"No tweets found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {tweet},
        "Fetched Tweet"
    ))
})

export {uploadTweet, deleteTweet, getAllTweet}