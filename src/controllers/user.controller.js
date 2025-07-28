import {asynchandler} from "../utils/asynchandler.js";
import {APIERROR} from "../utils/APIERROR.js";
import {User} from "../models/user.model.js";
import {upload} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {existed} from "../utils/user_exists.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async function (userid){
    try{
        /** @type {import("../models/user.model.js").User} */
        const user =await User.findById(userid)

        const accessToken =user.generateAccessToken()
         const  refreshToken = user.generateRefreshToken()
        user.refreshToken=refreshToken

        await user.save({validateBeforeSave:false})
        {
            /*
            so when u save user....it kicks the entire
            moongose model...where u req password username etc..
            but here we only wanna update the refreshtoken.
            hence use {validateBeforeSave:false}
             */
        }
        return {accessToken , refreshToken}
    } catch (e) {
        throw new APIERROR(500 , "sorry")

    }
}
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
    /*multer req.files ka access deta hai*/ const localpath_avatar =req.files?.avatar[0]?.path // multer jo banaya tha yaha utilize hoora

    //console.log("file path-> ",req)
    // ..?.. does is that ki kya yeh field exist krti hai
   // const loacalpath_coverimage = req.files?.coverImage[0]?.path
   //  const localpath_avatar = req.files && req.files.avatar && req.files.avatar.length > 0
   //      ? req.files.avatar[0].path
   //      : null;

    {
        /*
        req...multer
        isme files mei jo avatar aur coverimage hai vo array mei store hai...
        toh index dena zaruri hai...
         */
    }
    const localpath_coverimage = req.files && req.files.coverImage && req.files.coverImage.length > 0
        ? req.files.coverImage[0].path
        : null;


    if (!localpath_avatar) throw new APIERROR(400,"avatar de bsdk")
    const avatar = await upload(localpath_avatar) // will return info about the url
    const coverImage = await upload(localpath_coverimage)
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

const loginUser = asynchandler(async (req,res) =>{
    /*
    TO DO'S:
    1.FETCH DATA FROM FRONTEND
    2.VALIDATE DATA..
    3.CHECK IF USER EXISTS OR NOT..
    4.IF EXISTS THEN MATCH INPUTS..
    5.PROVIDE ACCESS AND REFRESH TOKEN..
    6.SEND SECURE COOKIES...
    7.RESPONSE ....

     */
    const {email , password} = req.body
    if (email.trim()==="" || password.trimEnd()==="") throw new APIERROR(400,"PASSWORD AND USERNAME IS REQUIRED")
    if (!email.trim().includes('@')) throw new APIERROR(100, "ENTER VALID EMAIL ADDRESS")

    const user = await existed(email)//this instance of user doesnt contain reftoken
    if (!user) throw new APIERROR(404,"PLEASE REGISTER")
    // database se jab bhi baat krni hai ...await always


    const isCorrect = await user.isPasswordCorrect(password)




    if (!isCorrect) throw new APIERROR(401, "PASSWORD WRONG")
    const access_refresh =await generateAccessAndRefreshToken(user._id)
    const refreshToken = access_refresh.refreshToken
    const accessToken = access_refresh.accessToken
    user.refreshToken = ""
    user.password = ""
    const loggedIn = user /*yaha user.select wala err isiliye tha cause .select hamesha tabhi lagega jab query run horai hoo*/
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
        .status(200)
        .cookie("accessToken" , accessToken,options)// the string is the name of the cookie
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200, {
                user: loggedIn ,accessToken,refreshToken

            },"user logged in successsfully")
        )

    {
        /*
        here i am returning cookie and accesstoken with the status
         */
    }









})
const logoutUser = asynchandler(async(req ,res) =>{
// problem id we are not taking any input while loggin out ...so we cannot find the user and remove the info from database
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
)

    const options = {
        httpOnly:true,
        secure:true
    }
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200 , {} ,"user logged out"))


})
const generateRefreshAccessToken= asynchandler((req , res)=>{
    /*
    TO DO'S:
    1.get refresh token from cookies
    2.validate it.
    3.decode the refreshToken.
    4.get the user id and search the user in database.
    5.match the refreshToken obtained and the one in the database
    6.once validated , generate new access and refresh tokens and create their cookies.

     */
    const token = req.cookies?.refreshToken || req.body.refreshToken
    if (!token) throw new APIERROR(401 , "unauthorised access")
    const decoded_token = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    if (!decoded_token)throw new APIERROR(401 , "something went wrong")
    const user = await User.findById(decoded_token?._id).select("-password")
    if (token!==user.refreshToken) throw new APIERROR(401,"unauthorised access")
    const {new_accessToken , new_refreshToken} = generateAccessAndRefreshToken(decoded_token._id)
    const options = {
        httpOnly:true,
        secure:true
    }

    res
        .status(200)
        .cookie("accessToken" ,options,new_accessToken )
        .cookie("refreshToken", options,new_refreshToken)
        .json(new ApiResponse(200, {new_refreshToken,new_accessToken},"generated successfully"))




})
export {registerUser,loginUser,logoutUser,generateRefreshAccessToken}