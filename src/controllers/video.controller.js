import mongoose,{isValidObjectId} from "mongoose";
import {upload_mul} from "../middlewares/multer.middleware.js";
import {deleteFromCloudinary, upload} from "../utils/cloudinary.js";
import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";

import {throws} from "node:assert";

const getAllVideos = asynchandler(async (req, res) => {

    /** @type {import("../models/video.model.js").Video} */


    const { page, limit, query, sortBy, sortType, userId } = req.query
    if(!query ||!sortBy||!sortType||!userId||!isValidObjectId(userId)) throw new APIERROR(400 , "nah")

    const skip = (parseInt(page)-1)*parseInt(limit)
    const allVideos = await User.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(userId)
        }

    },{
        $lookup:{
            from:"videos",
            pipeline:[{
                $match:{
                   title:{
                       $regex:query,
                       $options:"i"
                   }
                }
            },{
                $sort:{
                    [sortBy]:sortType ==="asc"? 1:-1
                }

            },{
                $skip:skip
            },{
                $limit:parseInt(limit)
            }],
            as:"matched"
        }
    },{
        $project:{
            matched:1
        }

    }])
    if (allVideos.length<=0 || allVideos.matched.length <=0) throw new APIERROR(400 ,"VIDEOS NOT MATCHED")
    res.status(200)
        .json(new ApiResponse(200 , allVideos , "here are your results"))




})

const publishVideo = asynchandler( async (req,res)=>{

    /** @type {import("../models/video.model.js").Video} */

    const {title , description} = req.body
    if (!title || !description) throw new APIERROR(400 , "enter details")
    const local_path_vid = req?.files?.videoFile[0]?.path
    const local_path_thumb = req?.files?.thumbnail[0]?.path
    if (!local_path_thumb || !local_path_vid) throw new APIERROR(200 , "upload all files")
    const upload_vid = await upload(local_path_vid)
    const upload_thumb = await upload(local_path_thumb)
    if (!upload_thumb.url || !upload_vid.url) throw new APIERROR(400 , "cloudinary mistake")
    console.log("cloud--->" , upload_vid)
    const video = await Video.create({
        videoFile: upload_vid.url || "",
        thumbnail: upload_thumb.url || "",
        owner: req?.user?._id,
        title:title,
        description:description,
        duration: upload_vid.duration || ""


    })
    if (!video) throw new APIERROR(400, "video not created")

    res.status(200)
        .json(new ApiResponse(200 , video ,"success video created"))






})

const getVideoById = asynchandler( async (req, res)=>{

    /** @type {import("../models/video.model.js").Video} */

    const {videoId} = req.params
    if (!videoId) throw new APIERROR(400 , "id not found")
    const video = await Video.findById(videoId)

    if (!video) throw new APIERROR(400 , "video not fetched")
    console.log(video._id)
    res.status(200)
        .json(new ApiResponse(200 , video , "here is your video"))

})

const updateVideo = asynchandler(async (req,res)=>{

    /** @type {import("../models/video.model.js").Video} */

    const {videoId} = req.params
    const {title = "null" , description = "null"} = req?.body
    if (!videoId) throw new APIERROR(400 , "id not found")
    const video_path = req?.file?.path
    if (!video_path) throw new APIERROR(400, "path not found")
    const upload_vid = await upload(video_path)
    if (!upload_vid.url) throw new APIERROR(200,"video not uploaded on cloud")
    const video = await Video.findById(videoId).select("-owner")
    video.videoFile = upload_vid?.url
    video.duration = upload_vid?.duration
    if(title!=="null") video.title = title
    if(description!== "null") video.description  = description
    const updatedVideo = await video.save({validateBeforeSave:false})

    if (!video)throw new APIERROR(200 , "video not updated")

    res.status(200)
        .json(new ApiResponse(200,updatedVideo , "video updated"))


})

const deleteVideo = asynchandler(async (req, res) => {

    /** @type {import("../models/video.model.js").Video} */

    const { videoId } = req.params
    if (!videoId) throw  new APIERROR(200 , "id not found")
    const video = await Video.findByIdAndDelete(videoId)
    if (!video) throw new APIERROR(200 , "video not found or not deleted")
    const cloud_delete = await deleteFromCloudinary(video.videoFile)
    if (!(cloud_delete.result ==="ok")) throw new APIERROR(400 , "video not deleted from cloud")
    res.status(200)
        .json(new ApiResponse(200, {} , `video title ${video.title} deleted`))
})




export { getAllVideos ,publishVideo , getVideoById , updateVideo , deleteVideo}
