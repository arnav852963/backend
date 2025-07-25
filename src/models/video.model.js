import mongo , {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type:String, // outsource

    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0

    },
    isPublished: {
        type:Boolean,
        default:true
    },



} , {timestamps:true})

export const Video = mongo.model("Video" , videoSchema)