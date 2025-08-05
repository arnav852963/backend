import {Router} from "express"
import {
    changePassword,
    generateRefreshAccessToken,
    getuser,
    loginUser,
    logoutUser,
    registerUser, updateCoverImage, updateUserAvatar, updateUserInfo
} from "../controllers/user.controller.js";
import {upload_mul} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(
    //yaha lagega middleware....post krne se pehle milke jana
    upload_mul.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
{
    /*
    post sends data to the server so that the server
    can add it to the resource
     */
}
router.route("/login").post(loginUser)

//secure routes..
router.route("/logout").post(/*middleware injected*/verifyJWT ,logoutUser)
router.route("/gen-refreshToken").post(generateRefreshAccessToken)
router.route("/myaccount").get(verifyJWT,getuser)
router.route("/changepassword").post(changePassword)
router.route("/update").post(verifyJWT,updateUserInfo)
router.route("/updateUserAvatar").post(upload_mul.single("avatar"),verifyJWT,updateUserAvatar)
router.route("/updateCoverImage").post(upload_mul.single("coverImage"),verifyJWT,updateCoverImage)
export default router