import express from "express";
import cors from "cors";
import cookie from "cookie-parser";
const app= express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
})) // jo apna front_end hai sirf usi ko baaaat krnedenge....aur kisi ko nai

app.use(express.json({limit: '16kb'}))
// url is a zariya backend se communicate krne ka
app.use(express.urlencoded({extended: true, limit:'16kb'}))
app.use(express.static("public"))
app.use(cookie()) //global middleware.


// routes import
import user_router from "./routes/user.routes.js";



//routes declaration
app.use("/api/v1/user" , user_router)
{
    /*
    so .....app.use jaise hi call hua....
    pehle..i will route the user file i.e user.route.js
    then from there i will route to the regiterfile
     */
}
import healthCheckRoute from "./routes/healthCheck.route.js";
app.use("/api/v1" , healthCheckRoute)

import videoRoute from "./routes/video.route.js";
app.use("/api/v1/video" , videoRoute)

import subscriptionRoute from "./routes/subscription.route.js";
app.use("/api/v1/subscriptions" , subscriptionRoute)

import tweetRoutes from "./routes/tweet.routes.js";
app.use("/api/v1/tweets" , tweetRoutes)




export {app}
{
    /*
    middle ware is basically req krdi ab
    ye dekho ki request reasonable hai ya nai...
    befor sending a response...
    jaise ....admin nai hooo ..
    phir be admin portal pr req bhejre..
    toh middle ware req blockkrdega
    (err,req,res,next)...next is a flag
     */
}