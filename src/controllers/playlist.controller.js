import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Playlist} from "../models/playlist.model.js";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import mongoose,{Schema,isValidObjectId} from "mongoose";

const createPlaylist = asynchandler(async (req,res)=>{
    const {name ,description} = req.body
    if (!name || !description || !isValidObjectId(req.user._id)) throw new APIERROR(400 , "enter details or user not authenticated")
    const playlist = await Playlist.create({
        name: name,
        description:description,
        owner:req?.user?._id
    })
    if (!playlist) throw new APIERROR(400 , "playlist not created")

    res.status(200)
        .json(new ApiResponse(200 , playlist,"playlist created"))

})

const getUserPlaylist = asynchandler(async (req,res)=>{
    const playlists = await User.aggregate([{
        $match:{
            _id:new mongoose.Types.ObjectId(req.user._id)
        }
    },{
        $lookup:{
            from:"playlists",
            localField:"_id",
            foreignField:"owner",
            as:"userPlaylist"
        }
    },{
        $project:{
            UserPlaylist:1
        }
    }])

    if (playlists.length<=0) throw new APIERROR(400 , "cant get the playlists")

    res.status(200)
        .json(new ApiResponse(200 , playlists, "here are your playlists"))


})

const getPlaylistById = asynchandler(async (req,res)=>{
    const {playlistId} =req.params
    if (!playlistId) throw new APIERROR(400 , "no id")
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new APIERROR(400 , 'no playlist')

    res.status(200)
        .json(new ApiResponse(200,playlist,"here is your playlist"))


})

const addVideoToYourPlaylist = asynchandler(async (req,res)=>{
    const {playlistId , videoId} = req.params
    if (!playlistId || videoId) throw new APIERROR(400 ,"no ids")
    const playlist = await Playlist.findByIdAndUpdate(playlistId , {
        $push:{
            videos:videoId
        }
    } , {new:true}).select("-name -description -owner")
    if (!playlist)  throw new APIERROR(400 ,"playlist doesnt exist")

    res.status(200)
        .json(new ApiResponse(200 , playlist ,"added video"))





})

const updatePlaylist = asynchandler(async (req,res) =>{
    const {playlistId} = req.params
    const {name , description} = req.body
    if (!playlistId) throw new APIERROR(400 ,"no id or body")
    const updated = await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name:name,
            description:description
        }
    },{new:true}).select("-videos -owner")
    if (!updated) throw new APIERROR(400 ,"playlist not updated")

    res.status(200)
        .json(new ApiResponse(200 ,updated , "playlist updated" ))


})
const removeVideoFromPlaylist = asynchandler(async (req,res)=>{
    const {playlistId , videoId} = req.params
    if (!playlistId||!videoId)throw new APIERROR(400 ,"no ids")
    const playlist = await Playlist.findByIdAndUpdate(videoId,{
        $pull:{
            videos:videoId
        }
    } , {new:true}).select("-name -description -owner")

    if (!playlist) throw new APIERROR(400 ,"not deleted")

    res.status(200)
        .json(new ApiResponse(200 ,playlist , "video deleted from playlist"))

})

const deletePlaylist = asynchandler(async (req,res)=>{
    const {playlistId} = req.params
    if (!playlistId) throw new APIERROR(400 ,"no ids")
    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if (!playlist) throw new APIERROR(400 ,"not deleted")

    res.status(200)
        .json(new ApiResponse(200,playlist,"this playlist deleted"))
})



export {createPlaylist , getUserPlaylist,getPlaylistById , addVideoToYourPlaylist , updatePlaylist , removeVideoFromPlaylist , deletePlaylist}


