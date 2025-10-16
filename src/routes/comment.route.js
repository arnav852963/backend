import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {addComment, deleteComment, editComment, getVideoComments} from "../controllers/comment.controller.js";

const commentRoute = Router()
commentRoute.use(verifyJWT)
commentRoute.route("/getVideoComments").get(getVideoComments)
commentRoute.route("/add").post(addComment)
commentRoute.route("/edit").patch(editComment)
commentRoute.route("/delete").delete(deleteComment)



export default commentRoute