import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {User} from "../models/user.model.js";
import {upload} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {existed} from "../utils/user_exists.js";
const  registerUser = asynchandler(async (req, res)=>{
    {
        /*
        steps for registering user:
        1.get user data from frontend.
        2.validation...
        3.check if user already exists..
        4.check for images...for avatar...
        5.upload then to clodnary..avatar
        6.create user object - create entry in db...
        7.remove password and refreshtoken..
        8.check for user creation...
        9.return response

         */

    }
    const {fullName ,email,username,password} =req.body
    console.log(email,"->email")
    /*if (fullName ==="") {
        throw  new APIERROR(400,"fullname is required")
    }
    now i can write if for each field but i will
    instead use an array
     */
    if ([fullName,email,username,password].some((item)=>{
        if (item) {
            if (!item.trim()) return true
        }
        return !item;


    })) throw new APIERROR(400,"all fields are compulsory")
    const existedUser =await User.findOne({
        $or:[{username} , {email}]

        // make sure to use await where needed
    })/*--this findone finds the first user schema which matches the {username} and {email}*/

    if (existedUser) throw new APIERROR(409,"user exists")
    /*multer req.files ka access deta hai*/const localpath_avatar =req.files?.avatar[0]?.path // multer jo banaya tha yaha utilize hoora

    //console.log("file path-> ",req)
    // ..?.. does is that ki kya yeh field exist krti hai
    const loacalpath_coverimage = req.files?.coverImage[0]?.path
    {
        /*
        req...multer
        isme files mei jo avatar aur coverimage hai vo array mei store hai...
        toh index dena zaruri hai...
         */
    }

    if (!localpath_avatar) throw new APIERROR(400,"avatar de bsdk")
    const avatar = await upload(localpath_avatar) // will return info about the url
    const coverImage = await upload(loacalpath_coverimage)
    // avatar required hai user model mei toh ek baar recheck ki successfully upload hua cloudinaruy pr ya nai
    if (!avatar) throw new APIERROR(400,"avatar dee")

    const user =  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username

    })

   const created = await User.findById(user._id).select(
       "-password -refreshToken"
   )
    if (!created) throw new APIERROR(500,"WHILE CONNECTING SOMETHING WENT WRONG")


    return res.status(201).json(
        new ApiResponse(200,created , "registered succesfullly")
    )







})
export {registerUser}