import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Subscription} from "../models/subscription.model.js";
import {asynchandler} from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import mongoose,{isValidObjectId} from "mongoose";

const toggleSubscription = asynchandler(async (req,res)=>{
    const {channelId} = req.params
    if (!channelId || !isValidObjectId(channelId)) throw new APIERROR(400 , "naah")
    const exists = await Subscription.findOne({
        channel:channelId,
        subscriber:req?.user?._id
    })
    if (exists){
        const unsubscribe = await Subscription.deleteOne({
            channel:channelId,
            subscriber:req?.user?._id

        })
        if (unsubscribe.deletedCount ===0) throw new APIERROR(400 , "cant delete")

        return res.status(200)
            .json(new ApiResponse(200, {} ,`unsubscribed `))
    }
    const subscribed = await Subscription.create({
        channel:channelId,
        subscriber:req?.user?._id
    })
    if (!subscribed) throw new APIERROR(400 , "cant subscriber")
    return res.status(200)
        .json(new ApiResponse(200 , subscribed , `subscribed to ${subscribed.channel}`))


})
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params
    if (!channelId ||!isValidObjectId(channelId)) throw new APIERROR(400 , "naah")
    const subscriber = await Subscription.aggregate([{
        $match:{
            channel : new mongoose.Types.ObjectId(channelId)
        }
    },{
        $project:{
            subscriber:1
        }
    }])
    if (subscriber.length === 0)  throw new APIERROR(400 , "couldnt fetch subscribers")
    return res.status(200)
        .json(new ApiResponse(200 , subscriber , "here are your subscribers"))

})
const getChannelsSubscribedTo = asynchandler(async (req,res)=>{

    const channels = await Subscription.aggregate([{
        $match:{
            subscriber : new mongoose.Types.ObjectId(req?.user?._id)
        }
    },{
        $project:{
            channel:1
        }
    }])
    if (channels.length === 0)  throw new APIERROR(400 , "couldn't fetch channels subscribed")
    return res.status(200)
        .json(new ApiResponse(200 , channels , "here are your channel subscribers"))


})

export {toggleSubscription ,getUserChannelSubscribers , getChannelsSubscribedTo}
