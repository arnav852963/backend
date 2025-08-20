import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Subscription} from "../models/subscription.model.js";
import {asynchandler} from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import mongoose,{isValidObjectId} from "mongoose";

const toggleSubscription = asynchandler(async (req,res)=>{
    const {channelId} = req.params

})
