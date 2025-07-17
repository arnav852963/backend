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
app.use(cookie())
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