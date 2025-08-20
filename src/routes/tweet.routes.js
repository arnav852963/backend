import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {createTweet, deleteTweet, getUserTweets, updateTweet} from "../controllers/tweet.controller.js";
const tweetRoutes = Router()

tweetRoutes.route("/create").post(verifyJWT , createTweet)
tweetRoutes.route("/get").get(verifyJWT , getUserTweets)
tweetRoutes.route("/update").patch(verifyJWT , updateTweet)
tweetRoutes.route("/delete").delete(verifyJWT , deleteTweet)






export default tweetRoutes