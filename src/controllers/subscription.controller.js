import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    
        const { channelId } = req.params
        const findSub = await Subscription.findOne(
            { $and: [{ subscriber: (req.user?._id) }, { channel: channelId }] }
        )
        
        if (!findSub) {
            const subscribed = await Subscription.create(
                {
                    subscriber: req.user?._id,
                    channel: channelId
                }
            )
            if (!subscribed) {
                throw new ApiError(
                    400,
                    "Error while Toggle Subscriber"
                )
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        subscribed,
                        "Subscribed to channel"
                    )
                )
        }
        const unSub = await Subscription.findByIdAndDelete(findSub._id)
        if (!unSub) {
            throw new ApiError(
                400,
                "Error while unsubbing"
            )
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    unSub,
                    "UnSubed from Channel"
                )
            )
   
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
        const {subscriberId} = req.params
        if (!isValidObjectId(subscriberId)) {
            throw new ApiError(
                400,
                "invalid subscriber Id"
            )
        }
        
        const channelList = await Subscription.aggregate([
            {
                $match: {
                    channel: subscriberId
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "subscriber",
                    as: "subscriber",
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                fullName:1,
                                avatar:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    subscriber:{
                        $first:"$subscriber"
                    }
                }
            },
            {
                $project:{
                    subscriber:1,
                    createdAt:1,
                    totalViews:1
                }
            }
        ])
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    channelList,
                    "Fetched Subscriber list"
                )
            )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

        const { channelId } = req.params
        
        const channelList = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "channel",
                    as: "channel"
                }
            }
        ])
        
        if (!channelList) {
            throw new ApiError(
                400,
                "Error while getting My subscribed List"
            )
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    channelList,
                    "Fetched Subscribed list"
                )
            )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}