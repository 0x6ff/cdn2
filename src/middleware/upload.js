const util = require("util");
const fs = require("fs");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024 * 1024;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __basedir + "/../resources/static/assets/uploads/");
	},
	filename: (req, file, cb) => {
		file.originalname = makeid(16) + "_" + file.originalname
		console.log(file.originalname);
		if (fs.existsSync(__basedir + "/../resources/static/assets/uploads/" + file.originalname)) {
			cb(new Error(`File ${file.originalname} is already uploaded!`));
		} else {
			cb(null, file.originalname)
		}
	},
});

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;