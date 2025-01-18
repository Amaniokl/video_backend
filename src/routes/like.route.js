import express from "express";
import {
    toggleVideoLike,
    toogleCommentLike,
    toggleTweetLike,
    getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secured routes (require JWT authentication)
router.use(verifyJWT);

// Route to toggle like for a video
router.route("/video/:videoId").post(toggleVideoLike);

// Route to toggle like for a comment
router.route("/comment/:commentId").post(toogleCommentLike);

// Route to toggle like for a tweet
router.route("/tweet/:tweetId").post(toggleTweetLike);

// Route to get all liked videos by the user
router.route("/videos").get(getLikedVideos);

export default router;
