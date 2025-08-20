import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {Tweet} from "../models/tweet.model.js";
import mongoose,{isValidObjectId} from "mongoose";

const createTweet = asynchandler(async (req,res)=>{
    const {content} = req.body
    if (!content.trimEnd()) throw new APIERROR(400 , "empty body")
    const tweet = await Tweet.create({
        content:content,
        owner:req.user._id
    })
    if (!tweet) throw new APIERROR(400 , "tweet not generated")
    res.status(200)
        .json(new ApiResponse(200 ,tweet , "tweeted"))

})

const getUserTweets = asynchandler(async  (req,res) =>{
    const tweets = await User.aggregate([{   //always returns an array even if its single object..
        $match:{
            _id:new mongoose.Types.ObjectId(req.user._id)
        }
    },{
        $lookup:{
            from:"tweets",
            localField:"_id",
            foreignField:"owner",
            as:"TWEETS"   // automatically adds field to the user
        }
    },{
        $project:{
            TWEETS:1
        }
    }])
    if (tweets.length === 0) throw new APIERROR(400 , "no tweets")
    res.status(200)
        .json(new ApiResponse(200 , {tweets:tweets.TWEETS}) , "here are your tweets")

})
const updateTweet = asynchandler(async  (req , res)=>{
    const {tweetId} = req.params
    const isValid = isValidObjectId(tweetId)
    const {text} = req.body
    if (!isValid || !text) throw  new APIERROR(400 ,"bhai yeh toh..shuru hone se pehle hi khatam hoogaya")
    const tweet = await Tweet.findByIdAndUpdate(tweetId , {
        $set:{
            content:text
        }
    },{new:true}).select("-owner")
     if (!tweet) throw new APIERROR(400 , "tweet not updated")
    res.status(200)
        .json(new ApiResponse(200, tweet , "updated tweet"))


})

const deleteTweet = asynchandler(async (req,res)=>{
    const {tweetId} = req.params
    const isvalid = isValidObjectId(tweetId)
    if (!isvalid) throw new APIERROR(400, "shurur hooone se pehle hi khatam")
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if (!tweet) throw new APIERROR(400 , "not deleted")

    res.status(200)
        .json(new ApiResponse(200 , tweet,"deleted tweet"))




})



export {createTweet , getUserTweets , updateTweet,deleteTweet}
