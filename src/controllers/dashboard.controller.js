import {Video} from "../models/video.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {APIERROR} from "../utils/APIERROR.js";
import {asynchandler} from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import mongoose from "mongoose";

const channelStats = asynchandler(async (req,res)=>{
    const everyUserStat = await User.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(req?.user?._id)
        }

    },{
        $lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            as:"yourVideos"
        }
    },{
        $lookup:{
            from: "subscriber",
            localField: "_id",
            foreignField: "channel",
            as:"subscriber"
        }
    },{
        $lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            pipeline:[{
                $lookup:{
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"videoLikes"
                }
            },{
                $addFields:{
                    likecount:{$size:"$videoLikes"}
                }
            },{
                $project:{
                    likecount:1
                }
            }],
            as:"videos_"

        }
    },{
        $addFields:{
            videoCount:{$size:"$yourVideos"},
            subscriberCount:{$size:"$subscriber"},
            totalLikesOnVideos:{$sum:"$video_.likecount"},
            viewsCount:{$sum:"$yourVideos.views"}

        }
    },{
        $project:{
            videoCount:1,
            subscriberCount:1,
            totalLikesOnVideos:1,
            viewsCount:1,

        }
    },])
    if (!everyUserStat|| everyUserStat.length ===0 )throw new APIERROR(400 , "can get stats")
    return res.status(200)
        .json(new ApiResponse(200 , everyUserStat[0] , "here are your stats"))

})


const getChannelVideos  = asynchandler(async (req,res)=>{
    const videos = await User.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(req.user._id)
        }
    },{
        $lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            as:"videos"
        }
    },{
        $project:{
            videos:1
        }
    }])
    if (videos.length<=0) throw new APIERROR(400 ,"no videos found")
    res.status(200)
        .json(new ApiResponse(200 , videos ,"here are your videos"))
})
export {getChannelVideos,channelStats}