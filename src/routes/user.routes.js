import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js";


const router = Router()
router.route("/register").post(registerUser)
{
    /*
    post sends data to the server so that the server
    can add it to the resource
     */
}
export default router