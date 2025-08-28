import mongoose,{Schema,isValidObjectId} from "mongoose";
import {ObjectId} from "mongodb";

const playlistModel = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videos:[
            {
                type:Schema.Types>ObjectId,
                ref:"Video"

            }

            ],
    owner:{
        type:Schema.Types>ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Playlist = mongoose.model("Playlist" , playlistModel)