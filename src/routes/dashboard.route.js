import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {channelStats, getChannelVideos} from "../controllers/dashboard.controller.js";
const dashboardRoute = Router()
dashboardRoute.use(verifyJWT)
dashboardRoute.route("/getChannelVideos").get(getChannelVideos)
dashboardRoute.route("/getChannelStats").get(channelStats)




export default dashboardRoute