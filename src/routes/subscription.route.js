import  {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {
    getChannelsSubscribedTo,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controller.js";

const subscriptionRoute = Router();
subscriptionRoute.use(verifyJWT)
subscriptionRoute.route("/toggle").post(toggleSubscription)
subscriptionRoute.route("/getSubscribers").get(getUserChannelSubscribers)
subscriptionRoute.route("/getSubscribedTO").get(getChannelsSubscribedTo)


export default subscriptionRoute