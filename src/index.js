import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
import mongo from "mongoose";
import db from "./db/index.js";



db() // import db

















// import express from "express"
// const app= express();
// ;(async ()=>{
//     try{
//         await mongoose.connect(`${process.env["MONGODB_URI "]}/${DB_NAME}`)
//
//     } catch (e){
//
//     }
//
// })()