class APIERROR extends Error{
    constructor(
        statuscode,
        message= "something went wrong",
        errors = [],
        stack =""

    )
    {
        super(message)/*super keyword is used to inherit parent class properties*/
        this.statuscode = statuscode
        this.data=null// no parameters req as its a fixed val
        this.message = message
        this.success = false; // no parameters req as its a fixed val
        this.errors = errors;
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this , this.constructor)
        }


    }
}
export {APIERROR}
