import mongo ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from  "bcrypt"

import * as string_decoder from "node:string_decoder";
const userSchema = new Schema({
    username :{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
        index: true



    },
    email :{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,


    },
    fullName :{
        type: String,
        required: true,
        trim : true,
        index: true



    },
    avatar : {
        type: String, // cloudnartArt
        required:true
    },
    coverImage : {
        type:String, // cloudnaryArt
        required: false
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref : "Video"
        }
    ],


    password :{
        type: String,
        required: [true , "Password is required"],
    },
    refreshToken:{
        type:String
    }


} , {timestamps : true})
userSchema.pre("save" , async function (next/*next flag ..pass to the next middleware*/) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password , 10);
    next();
    /*
    upto this...anytime we change data in any  user field...this middleware will run
    and encrpt the passwrod every time ..so we have to make sure that it does so
    only when password gets trigger
     */

});
userSchema.methods.isPasswordCorrect = async function(password) {

  return await bcrypt.compare(password , this.password) // boolean t or f
}
userSchema.methods.generateAccessToken = function (){
   /*we invoke this function once the data is saved in database
   so it has access to data*/

    return /*generate token*/jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullName : this.fullName, //name and key should be same for consistency


        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY

        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    /*we invoke this function once the data is saved in database
    so it has access to data*/

    return /*generate token*/jwt.sign(
        {
            _id: this._id,
             //name and key should be same for consistency


        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY

        }
    )
}
export const User = mongo.model("User" , userSchema)