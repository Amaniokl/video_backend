import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("temp"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.route.js'
import playlistRouter from './routes/playlist.route.js' 
import subscriptionRouter from './routes/subscription.route.js'
import likeRouter from './routes/like.route.js'
import commentRouter from './routes/comment.route.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/subsicription", subscriptionRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/comment", commentRouter)
// http://localhost:8000/api/v1/users/register

export {app}