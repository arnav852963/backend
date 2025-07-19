import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js";
import {upload_mul} from "../middlewares/multer.middleware.js";

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
            maxCount:3
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
export default router