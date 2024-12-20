import { asyncHandler } from "../utils/asyncHandler.js";
import {upload} from '../middlewares/multer.middleware.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser=asyncHandler(async(req, res)=>{
    // res.status(200).json({
    //     message: "ok"
    // })
    
    
    // upload them on cloudinary, avatar
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check for if user is created
    // return res

    // get user details from frontend
    const  {fullName, email, username, password}=req.body
    console.log("email: ", email);

    // validation - not empty
    if(fullName==="" || email==="" || username==="" || password===""){
        throw new ApiError(400, "All fields is required !!")
    }

    // check if user already registered: username, email
    const existedUser=await User.findOne({
        $or: [{email}, {username}]
    })
    if(existedUser){
        throw new ApiError(409,  "User with email or username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)  && req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser=await User.findById((user._id)).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, 
        "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}