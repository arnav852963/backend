//
// const asynchandler = (/*parameter function*/fn)=>{
//
//     return ()=>{
//         // basically function return karra hai...
//         //isi ko aise bhi likh sakte hai jaise neeche likha hai
//
//
//     }
// }
//

const asynchandler= (fun)=>async (req,res,next)=>{
    try {
        const response = await fun(req, res, next)
        return response
        
    } catch (e) {
        console.log("full error..." ,e)
        let statusCode = 0
        if (e.code>=100&& e.code<=1000) statusCode = e.code
        else statusCode = 500
        res.status(statusCode).json({
            success : false,
            message: e.message
        })
    }
    
}
export  {asynchandler}