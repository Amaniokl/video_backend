import { Router } from "express";
import { uploadVideo, getVideoById, updateVideoDetails, getAllVideos, deleteVideo, togglePublishStatus } from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/video-upload").post(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    verifyJWT,
    uploadVideo
)

router.route("/VideoId/:videoId").get(getVideoById)

router.route("/allVideos").get(verifyJWT, getAllVideos)

router.route("/delete/:videoId").delete(verifyJWT, deleteVideo)

router.route("/VideoId/:videoId").post(
    upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "video",
        maxCount: 1
    }
    ]),
    verifyJWT,
    updateVideoDetails
)
router.route("/tooglePublish/:videoId").post(verifyJWT, togglePublishStatus)
//secured routes
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)

export default router