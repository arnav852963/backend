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
        
    } catch (e) {
        res.status(e.code || 500).json({
            success : false,
            message: e.message
        })
    }
    
}