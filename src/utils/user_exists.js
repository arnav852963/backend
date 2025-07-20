import {User} from "../models/user.model.js";
const existed = async  (email) => {
    const res = await User.findOne({
        $or:[{email:email.toLowerCase()}]
    })
    return res
    // here i amk returning the value returned by the user.findOne..
    // i am caliing a function hence i return a value...
    // unlike asynchandler where i am just not calling a func.. returning the fun directly
}
export {existed}