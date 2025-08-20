import mongoose, {Schema} from "mongoose";

const tweetModel = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Tweet = mongoose.model("Tweet" , tweetModel)