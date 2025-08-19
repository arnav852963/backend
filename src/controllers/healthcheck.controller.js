import {asynchandler} from "../utils/asynchandler.js";
const healthCheck = asynchandler(async (_,res)=>{
    res
        .status(200)
        .json({message:"ok report"})


})
export {healthCheck}