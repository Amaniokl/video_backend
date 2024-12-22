import { asyncHandler } from "../utils/asyncHandler.js"
import { upload } from '../middlewares/multer.middleware.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import {jwt} from "jsonwebtoken"

// import { generateAccessTokens } from "../models/user.model.js"
// import { generateRefreshTokens } from "../models/user.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessTokens()
        const refreshToken = await user.generateRefreshTokens()
        // console.log(" "+refreshToken)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500,
            "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })


    // upload them on cloudinary, avatar
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check for if user is created
    // return res

    // get user details from frontend
    const { fullName, email, username, password } = req.body
    console.log("email: ", email);

    // validation - not empty
    if (fullName === "" || email === "" || username === "" || password === "") {
        throw new ApiError(400, "All fields is required !!")
    }

    // check if user already registered: username, email
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById((user._id)).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,
            "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    //recieve data from body
    const { username, password, email } = req.body

    //validate username and password
    if (username === "" || email == "") {
        throw new ApiError(400, "Username or password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    //match username and password with data base
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid login credentials")
    }

    //generate access tokens and refresh tokens
    const {accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id)
    // console.log("accesstoken       "+accessToken)
    // console.log("                                             ")
    console.log("refresh           "+refreshToken)
    const loggedInUser=await User
    .findById(user._id)
    .select("-password -refreshToken")

    //send cookie
    const options={
        httpOnly: true,
        secure: true
    }

    //login user
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                // accessToken: undefined,
                refreshToken: undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly: true,
        secure: true
    }
    // console.log(refreshToken)
    //logout user
    return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            "User logged out Successfully"
        )
    )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incominRefreshToken=req
        .cookies.refreshToken || req.body.refreshToken
    
    if(incominRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken=jwt.verify(
            incominRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user= await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incominRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        const options={
            httpOnly:true,
            secure: true
        }
    
        const {accessToken, newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(200,
                {accessToken, refreshToken: newrefreshToken},
                "Access token refreshed"
            )
        )
    }catch (error) {
        throw new ApiError(401, "Error in refreshing access tokens")
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken }