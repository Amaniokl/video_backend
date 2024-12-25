import { Router } from "express";
import { uploadVideo } from "../controllers/video.controllers.js";
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

//secured routes
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)

export default router