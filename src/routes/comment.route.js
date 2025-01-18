import express from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secured routes (require JWT authentication)
router.use(verifyJWT);

// Route to get all comments for a video
router.route("/video/:videoId").get(getVideoComments);

// Route to add a comment to a video
router.route("/video/:videoId").post(addComment);

// Route to update a specific comment
router.route("/:commentId").patch(updateComment);

// Route to delete a specific comment
router.route("/:commentId").delete(deleteComment);

export default router;
