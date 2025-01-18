import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route for user registration
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

// Route for user login
router.route("/login").post(loginUser);

// Secured routes (require JWT authentication)
router.use(verifyJWT);

// Route for user logout
router.route("/logout").post(logoutUser);

// Route for refreshing access token
router.route("/refresh-token").post(refreshAccessToken);

// Route for changing current password
router.route("/change-password").post(changeCurrentPassword);

// Route for getting current user details
router.route("/current-user").get(getCurrentUser);

// Route for updating account details
router.route("/update-account").patch(updateAccountDetails);

// Route for updating user avatar
router.route("/update-avatar").patch(
    upload.single("avatar"),
    updateUserAvatar
);

// Route for updating user cover image
router.route("/update-cover-image").patch(
    upload.single("coverImage"),
    updateUserCoverImage
);

// Route for getting user channel profile
router.route("/channel/:username").get(getUserChannelProfile);

// Route for getting user watch history
router.route("/watch-history").get(getWatchHistory);

export default router;