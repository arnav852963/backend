import {Router} from "express"
import {upload_mul} from "../middlewares/multer.middleware.js";
import {deleteVideo, getAllVideos, getVideoById, publishVideo, updateVideo} from "../controllers/video.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";


const videoRoute = Router();
videoRoute.route("/getAllVideos").get(verifyJWT , getAllVideos)

videoRoute.route("/uploadVideo").post(upload_mul.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]) , verifyJWT ,publishVideo)

videoRoute.route("/yourVideo").get(verifyJWT, getVideoById)
videoRoute.route("/updateVideo").patch(verifyJWT , updateVideo)
videoRoute.route("/deleteVideo").delete(verifyJWT , deleteVideo)

export default videoRoute