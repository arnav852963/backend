import mongoose from "mongoose";
import {upload_mul} from "../middlewares/multer.middleware.js";
import {upload} from "../utils/cloudinary.js";
import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {fips} from "node:crypto";
import {Video} from "../models/video.model.js";

const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

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
    const video = await Video.create({
        videoFile: upload_vid.url || "",
        thumbnail: upload_thumb.url || "",
        owner: req?.user?._id,
        title:title,
        description:description,
        duration: upload_vid.duration


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
    res.status(200)
        .json(new ApiResponse(200 , video , "here is your video"))

})

const updateVideo = asynchandler(async (req,res)=>{

    /** @type {import("../models/video.model.js").Video} */

    const {videoId} = req.params
    if (!videoId) throw new APIERROR(400 , "id not found")
    const video_path = req?.file?.path
    if (!video_path) throw new APIERROR(400, "path not found")
    const upload_vid = await upload(video_path)
    if (!upload_vid.url) throw new APIERROR(200,"video not uploaded on cloud")
    const video = await Video.findByIdAndUpdate(videoId , {
        $set:{
            videoFile:upload_vid.url
        }
    } , {new:true})

    if (!video)throw new APIERROR(200 , "video not updated")

    res.status(200)
        .json(new ApiResponse(200,video , "video updated"))


})

const deleteVideo = asynchandler(async (req, res) => {

    /** @type {import("../models/video.model.js").Video} */

    const { videoId } = req.params
    if (!videoId) throw  new APIERROR(200 , "id not found")
    const video = await Video.findByIdAndDelete(videoId)
    if (!video) throw new APIERROR(200 , "video not found or not deleted")
    res.status(200)
        .json(new ApiResponse(200, {} , `video title ${video.title} deleted`))
})




export {publishVideo , getVideoById , updateVideo , deleteVideo}
