import {asynchandler} from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {APIERROR} from "../utils/APIERROR.js";
import {User} from "../models/user.model.js";
import {Video} from "../models/video.model.js";
import {Comment} from "../models/comment.model.js";
import {Like} from "../models/like.model.js";
import mongoose,{isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.model.js";

const toggleVideoLike = asynchandler(async (req,res)=>{
    const {videoId} = req.params
    if (!videoId || ! isValidObjectId(videoId))  throw new APIERROR(400 , "naah")
    const video = await Video.findById(videoId)
    if (!video) throw new APIERROR(400 , "video not found")

    const exists  = await Like.findOne({
        video:videoId,
        likedBy:req?.user?._id
    })
    if (exists) {
        const removelike = await Like.deleteOne({
            video:videoId,
            likedBy:req?.user?._id
        })

        if (removelike.deletedCount ===0) throw  new APIERROR(400 , "not disliked")
       return res.status(200)
            .json(new ApiResponse(200 , dislike , "this like has been deleted"))
    }

    const like = await Like.create({
        video:videoId,
        likedBy:req?.user?._id
    })

    if (!like) throw  new APIERROR(400 , "not liked")
   return res.status(200)
        .json(new ApiResponse(200 , like , "video liked"))







})


const toggleCommentLike = asynchandler(async (req,res)=>{
    const {commentId} = req.params
    if (!commentId || ! isValidObjectId(commentId))  throw new APIERROR(400 , "naah")
    const comment = await Comment.findById(commentId)
    if (!commentId) throw new APIERROR(400 , "comment not found")

    const exists  = await Like.findOne({
        comment:commentId,
        likedBy:req?.user?._id
    })
    if (exists) {
        const removelike = await Like.deleteOne({
            comment:commentId,
            likedBy:req?.user?._id
        })

        if (removelike.deletedCount ===0) throw  new APIERROR(400 , "not disliked")
        return res.status(200)
            .json(new ApiResponse(200 , dislike , "this like has been deleted"))
    }

    const like = await Like.create({
        comment:commentId,
        likedBy:req?.user?._id
    })

    if (!like) throw  new APIERROR(400 , "not liked")
    return res.status(200)
        .json(new ApiResponse(200 , like , "comment liked"))







})

const toggleTweetLike = asynchandler(async (req,res)=>{
    const {tweetId} = req.params
    if (!tweetId || ! isValidObjectId(tweetId))  throw new APIERROR(400 , "naah")
    const tweet = await Tweet.findById(tweetId)
    if (!tweetId) throw new APIERROR(400 , "comment not found")

    const exists  = await Like.findOne({
        tweet:tweetId,
        likedBy:req?.user?._id
    })
    if (exists) {
        const removelike = await Like.deleteOne({
            tweet:tweetId,
            likedBy:req?.user?._id
        })

        if (removelike.deletedCount ===0) throw  new APIERROR(400 , "not disliked")
        return res.status(200)
            .json(new ApiResponse(200 , dislike , "this like has been deleted"))
    }

    const like = await Like.create({
        tweet:tweetId,
        likedBy:req?.user?._id
    })

    if (!like) throw  new APIERROR(400 , "not liked")
    return res.status(200)
        .json(new ApiResponse(200 , like , "tweet liked"))







})

const getLikedVideos = asynchandler(async (req,res)=>{
    const allVideo = await User.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(req?.user?._id)
        }
    },{
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"likedBy",
            pipeline:[{
                $match:{
                    video:{
                        $exists:true,
                        $ne:null
                    }
                }
            },{
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"allVideos"
                }
            },{
                $unwind:"$allVideos"
            },{
                $replaceRoot:{newRoot:"$allVideos"}
            }],
            as:"likedVideos",

        }
    },{
        $project:{
            likedVideos:1

        }
    }])
    if (allVideo.length === 0 || !allVideo) throw new APIERROR("400" , "no videos fetched")

    res.status(200)
        .json(new ApiResponse(200 , allVideo , "here are your videos" ))



})
export {toggleCommentLike,toggleTweetLike,toggleVideoLike,getLikedVideos}