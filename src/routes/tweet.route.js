import {Router} from "express";
import {deleteTweet, getAllTweet, uploadTweet} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/upload").post(verifyJWT, uploadTweet);

router.route("/delete/:tweetId").delete(verifyJWT, deleteTweet );
router.route("/getall/:userId").get(getAllTweet);
export default router;