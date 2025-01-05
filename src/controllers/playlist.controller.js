import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
        const {name, description} = req.body
   
        if(!name || !description){
            throw new ApiError(
                400,
                "Please Give All the fields"
            )
        }
        const newPlaylist = await Playlist.create(
            {
                name,
                description,
                owner:req.user?._id
            }
        )
        if (!newPlaylist) {
            throw new ApiError(
                500,
                "Error While creating message"
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newPlaylist,
                "Playlist created"
            )
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {

        const {userId} = req.params

        if (!isValidObjectId(userId)) {
            throw new ApiError(
                400,
                "Invalid userId"
            )
        }
        const findPlaylist = await Playlist.aggregate(
            [
                {
                    $match:{
                        owner: userId
                    }
                },
                {
                    $lookup:{
                        from:"videos",
                        localField:"videos",
                        foreignField:"_id",
                        as:"videos",
                        pipeline:[
                            {
                                $lookup:{
                                    from:"users",
                                    localField:"owner",
                                    foreignField:"_id",
                                    as:"owner"
                                }
                            },
                            {
                                $addFields:{
                                    owner:{
                                        $first:"$owner"
                                    }
                                }
                            },
                            {
                                $project:{
                                    title: 1,      
                                    thumbnail: 1,        
                                    description: 1,
                                    owner: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"createdBy",
                        pipeline:[
                            {
                                $project:{
                                    avatar:1,
                                    fullName:1,
                                    username:1
                                }
                            }
                    ]
                    }
                },
                {
                        $addFields:{
                            createdBy:{
                                $first:"$createdBy"
                            }
                        }
                },
                {
                    $project:{
                        videos  :1,
                        createdBy:1,
                        name:1,
                        description:1
                    }
                }
            ]
        )
        if (!findPlaylist) {
            throw new ApiError(
                500,
                "No such playlist found"
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                findPlaylist,
                "Got playlist"
            )
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
        const {playlistId} = req.params
      
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(
                400,
                "Invalid PlaylistId"
            )
        }
        const findedPlaylist = await Playlist.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(playlistId)
                }
            },
            {
          
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"createdBy",
                    pipeline:[
                        {
                            $project:{
                                fullName:1,
                                username:1,
                                avatar:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    createdBy:{
                        $first:"$createdBy"
                    }
                }
            },
            {
              
                $lookup:{
                    from:"videos",
                    foreignField:"_id",
                    localField:"videos",
                    as:"videos",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner"
                            }
                        },
                        {
                            $addFields:{
                                owner:{
                                    $first:"$owner"
                                }
                            }
                        },
                        {
                            $project:{
                                thumbnail:1,
                                title:1,
                                duration:1,
                                views:1,
                                owner:{
                                    fullName:1,
                                    username:1,
                                    avatar:1
                                },
                                createdAt:1,
                                updatedAt:1
                            }
                        }
                    ]
                }
            },
            {
                $project:{
                    name:1,
                    description:1,
                    videos:1,
                    createdBy:1
                }
            }
        ])
        if (!findedPlaylist[0]) {
            throw new ApiError(
                400,
                "No such Playlist found"
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                findedPlaylist[0],
                "Fetched playlist"
            )
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
        const {playlistId, videoId} = req.params
        if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
            throw new ApiError(
                400,
                "Invalid playlist or VideoId"
            )
        }
        const playList = await Playlist.findById(playlistId)
        if (!playList) {
            throw new ApiError(
                400,
                "No playlist found"
            )
        }
        if (!(playList.owner).equals(req.user?._id)) {
            throw new ApiError(
                400,
                "You cannot add video in this playlist"
            )
        }
        const found = (playList.videos).filter(video => video.toString() === videoId)
        if (found.length > 0) {
            throw new ApiError(
                400,
                "Video is already in the playlist"
            )
        }
        const newVideo = [...(playList.videos),videoId]
        const newPlaylist = await Playlist.findByIdAndUpdate(
            playList._id,
            {
                $set:{
                    videos:newVideo
                }
            },
            {new:true}
        )
        if (!newPlaylist) {
            throw new ApiError(
                500,
                "Error while Adding new video"
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newPlaylist,
                "Video added"
            )
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
        const {playlistId, videoId} = req.params
       
        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(
                400,
                "Invalid playlistId or videoId"
            )
        }
        const playList = await Playlist.findById(playlistId)
        if(!playList){
            throw new ApiError(
                400,
                "cannot find playlist"
            )
        }
        if(!((playList.owner).equals(req.user?._id))){
            throw new ApiError(
                400,
                "You cannot delete it"
            )
        }
        
        const newPlaylistVideo = (playList.videos).filter(v => v.toString() !== videoId)
        
        const updatePlaylistVideo = await Playlist.findByIdAndUpdate(
            playList._id,
            {
                $set:{
                    videos:newPlaylistVideo
                }
            },
            {
                new:true
            }
        ) 
        if (!updatePlaylist) {
            throw new ApiError(
                500,
                "Error While removing video from playlist"
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatePlaylistVideo,
                "removed video from playlist"
            )
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
        const {playlistId} = req.params
    
        if(!isValidObjectId(playlistId)){
            throw new ApiError(
                400,
                "Invalid PlaylistId"
            )
        }
        const findPlaylist = await  Playlist.findById(playlistId)
        if (!findPlaylist) {
            throw new ApiError(
                400,
                "Not found playlist"
            )
        }
        if (!((findPlaylist.owner).equals(req.user?._id))){
            throw new ApiError(
                400,
                "You cannot delete it"
            )
        }
        const deletedPlaylist = await Playlist.findByIdAndDelete(findPlaylist._id)
        if (!deletedPlaylist) {
            throw new ApiError(500,"Error while deleting vod")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedPlaylist,
                "successfully deleted playlist"
            )
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
   
    if (!(name || description)) {
        throw new ApiError(
            400,
            "please fill required detail"
        )
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(
            400,
            "Invalid PlaylistId"
        )
    }
    const findPlaylist = await  Playlist.findById(playlistId)
    if (!findPlaylist) {
        throw new ApiError(
            400,
            "Not found playlist"
        )
    }
    if (!((findPlaylist.owner).equals(req.user?._id))){
        throw new ApiError(
            400,
            "You cannot delete it"
        )
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        findPlaylist._id,
        {
            $set:{
                name,
                description
            }
        },
        {new:true}
    ) 
    if (!updatedPlaylist) {
        throw new ApiError(
            400,
            "Error while updating playlist"
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "values updated"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}