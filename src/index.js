import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
import mongo from "mongoose";
import db from "./db/index.js";
import {app} from "./app.js";



db()
    .then(()=>{

        //listen app
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log(`runnnin at${process.env.PORT}`)

        })
        app.on("error" , (error) =>{
            console.log( "errrrrrrrr........!-  " , error);
            throw error
        })


    })
    .catch((error)=>{
        console.log(`err.......${error}`)
    })



















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