import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.model.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import mongoose,{isValidObjectId} from "mongoose";

const getVideoComments = asynchandler(async (req , res) =>{
    const {videoId} = req.params
    const{page , limit } = req.query
    const skip = (page-1)*limit

    if (!videoId || !page||!limit||!isValidObjectId(videoId)) throw new APIERROR(400,"naah")
    const comments_ = await Video.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(videoId)
        }
    },{
        $lookup:{
            from:"comments",
            let:{videoId:"$_id"},
            pipeline:[{
                $match:{
                    $expr:{
                        $eq:["$video" , "$$videoId"]  // jis jis comment ke video field equal to videoId hai usko collecgt krdiya...
                    }
                }
            },{
                $sort:{
                    createdAt:-1 // newest created
                }
            },{
                $skip:skip // basicallt agr ppage 1 hai ..toh usme 0 se limit tk ke hi comments aayenge ...like first 5 comments if limit is 5
            },{
                $limit:limit
            }],


            as:"comments" // subset of comments depends on page
        }
    },{
        $project:{
            comments:1
        }
    }])
    if (comments_.length<=0 || comments_.comments.length === 0) throw new APIERROR(400,"comments not reflected")
    res.status(200)
        .json(new ApiResponse(200 , comments_[0] , "here are your comments"))
})


const addComment = asynchandler(async (req,res)=>{
    const {videId} = req.params
    const {content}  = req.body
    if (!videId || !content || !isValidObjectId(videId)) throw new APIERROR(400 , "naaah")
    const comment = await Comment.create({
        content:content,
        video:videId,
        owner:req?.user?._id
    })
    if(!comment)  throw new APIERROR(400 , "no comment")
    res.status(200)
        .json(new ApiResponse(200 , comment , "comment added"))


})

const editComment = asynchandler(async (req,res)=>{
    const {commentId} = req.params
    const {content} = req.body

    if (!content ||commentId||!isValidObjectId(commentId)) throw new APIERROR(400,"naaah")

    const edited = await Comment.findByIdAndUpdate(commentId , {
        $set:{
            content:content
        }

    } , {new:true})
    if (!edited) throw new APIERROR(400,"edited your comment")
    res.status(200)
        .json(new ApiResponse(200 , edited,"your comment is edited"))

})

const deleteComment = asynchandler(async (req , res) =>{
    const {commentId} = req.params
    if (!commentId ||!isValidObjectId(commentId)) throw new APIERROR(400,"naah")
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!commentId) throw new APIERROR(400,"cant be deleted ")

    res.status(200)
        .json(new ApiResponse(200 , comment , "comment deleted"))

})

export {addComment , editComment,deleteComment , getVideoComments}