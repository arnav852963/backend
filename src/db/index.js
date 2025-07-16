// require('dotenv').config();

import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import * as constants from "node:constants";
console.log(process.env["MONGODB_URI"])
const db = async ()=>{
    try {
         const mongo = await mongoose.connect(`${process.env["MONGODB_URI"]}/${DB_NAME}`)
        console.log(`CONNECTED : ${mongo.connection.host}`)


    } catch (e) {
        console.log("ERROR..." , e);
        process.exit(1)

    }
}
export default db;
