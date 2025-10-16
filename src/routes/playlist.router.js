import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToYourPlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoute = Router();
playlistRoute.use(verifyJWT);

playlistRoute.route("/createPlaylist").post(createPlaylist);
playlistRoute.route("/getUserPlaylists").get(getUserPlaylist);
playlistRoute.route("/getPlaylistById/:playlistId").get(getPlaylistById);
playlistRoute.route("/addVideo/:playlistId/:videoId").post(addVideoToYourPlaylist);
playlistRoute.route("/updatePlaylist/:playlistId").patch(updatePlaylist);
playlistRoute.route("/removeVideo/:playlistId/:videoId").delete(removeVideoFromPlaylist);
playlistRoute.route("/deletePlaylist/:playlistId").delete(deletePlaylist);

export default playlistRoute;
