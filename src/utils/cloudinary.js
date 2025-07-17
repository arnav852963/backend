//fileserver pe aachuki hai ...ab muje usko cloudianry pe dalna hai bs
import {v2 as cloudinary} from "cloudinary"
import fs from "fs" // file handeling mainly file kapath chahiye

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = async (local_str)=>{
    try{
        if (!local_str/*i.e if its empty*/) return "empty str";
        const res = await cloudinary.uploader.upload(local_str)
        console.log("uploaded successfully" , res.url)
        return res;

    } catch (e) {
        fs.unlinkSync(local_str) // remove the file from local storage
        return "file not uploaded and now removed"



    }
}

export {upload}

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