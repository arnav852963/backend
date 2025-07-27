import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
}) // these all are parameters
// cb is basically callback or returning values in simple terms...
export const upload_mul = multer({ storage: storage })
