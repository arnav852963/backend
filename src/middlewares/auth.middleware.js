//verify if user exists or not
import {asynchandler} from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import {APIERROR} from "../utils/APIERROR.js";
import {User} from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req,/*res is empty*/ _ ,next ) =>{
   try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       /*req.cookies not req.cookie*/
       console.log("token is ---> " ,token)

       {/*logout tabhi krunga jab login krunga hence access toh hona hi chahiye*/
       }
       if (!token) throw new APIERROR(401, "unauthorised req")

       // we give jwt the info we want to give ass tokens..it encrypts that info...
       //so we have to decrypt that info to check if its correct or not...

       const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//only thy can decrypt who has secret token
       const user = await User.findById(decoded_token?._id).select("-password -refreshToken")
       if (!user) {
           //discusss about frontend
           throw new APIERROR(401, "invalid access")
       }
       req.user = user
       next()
   } catch (e){
   throw  new APIERROR(401 ,e?.message || "invalid access" )
   }

// middle wares always used in routes
    //decode krke info nikal ke req.user mei daaal di .


})