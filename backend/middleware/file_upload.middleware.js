import multer from "multer";
import path from "path";

const storage =  multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, "uploads/")
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, Date.now()+ext)
    }
});

function fileFilter(req, file, cb){
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }
    else{
        cb(new Error("only images are allowed"), false);
    }
}

const upload = multer({storage, fileFilter});

export default upload;