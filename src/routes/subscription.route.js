import express from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secured routes (require JWT authentication)
router.use(verifyJWT);

// Route to toggle subscription (subscribe/unsubscribe)
router.route("/toggle/:channelId").post(toggleSubscription);

// Route to get the subscriber list of a channel
router.route("/subscribers/:subscriberId").get(getUserChannelSubscribers);

// Route to get the channel list a user has subscribed to
router.route("/subscribed/:channelId").get(getSubscribedChannels);

export default router;
