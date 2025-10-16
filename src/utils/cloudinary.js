//fileserver pe aachuki hai ...ab muje usko cloudianry pe dalna hai bs
/// <reference types="node" />

import {v2 as cloudinary} from "cloudinary"
import fs from "fs" // file handeling mainly file kapath chahiye
import {APIERROR} from "./APIERROR.js";
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
console.log( process.env.CLOUDINARY_API_KEY)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env["CLOUDINARY_API_KEY"],
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const upload = async (local_str)=>{
    try{
        if (!local_str/*i.e if its empty*/) return "empty str";
        const res = await cloudinary.uploader.upload(local_str,{
            resource_type:"auto"
        })
        //console.log("uploaded successfully" , res)


        return res;

    } catch (e) {
        fs.unlinkSync(local_str) // remove the file from local storage
        return "file not uploaded and now removed"



    }
}
const deleteFromCloudinary = async (url, resource_type = "video") => {
    if (!url) return null;

    try {

        const publicId = url.split("/").pop().split(".")[0];

        if (!publicId) {
            throw new APIERROR(400, "Could not extract public_id from URL");
        }


        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resource_type,
        });


        return result;

    } catch (error) {

        throw new APIERROR(500, `Failed to delete file from Cloudinary: ${error.message}`);
    }
};

export {upload , deleteFromCloudinary}

{
    //upr yehi kiya hai in a subtle manner
    /*
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });

    console.log(uploadResult);
     */
}