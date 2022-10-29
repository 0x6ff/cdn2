const uploadFile = require("../middleware/upload");
const bcrypt = require('bcrypt');
const mysql = require('mysql'); 
const envy = require('envy');
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";


const env = envy();
const REGISTER_TOKEN = env.registerToken;
const DB = env.db;
const USER = env.user;
const PASS = env.pass;


var con = mysql.createConnection({
host: "127.0.0.1",
user: USER,
password: PASS,
database: DB
});

async function auth (req, res, cb) {
    var isAuthorised = false;

	if (req.query.user_name == undefined || req.query.user_pw == undefined) {
		return cb(isAuthorised);
	}

	await con.query('SELECT * FROM USERS WHERE user_name = ?',[req.query.user_name], async function (err, results, fields) {
		if (err) { 
			res.send({          
				"code":400,          
				"failed":"error occurred",          
				"error" : error.code  
			})      
		} else {
			if (results.length > 0) {
				const comparison = await bcrypt.compare(req.query.user_pw, results[0].user_pw_hash)
				if (comparison) {
                    isAuthorised = true;
				} else {
					return cb(isAuthorised);
				}
			} else {
				return cb(isAuthorised);
			}
		}
		cb(isAuthorised);
	});
}

const upload = async (req, res) => {
    auth(req, res, async function(isAuthorised) {
        if (isAuthorised) {
            try {
                await uploadFile(req, res);
        
                if (req.file == undefined) {
                    return res.status(400).send({ message: "Please upload a file!" });
                }
        
                res.status(200).send({
                    message: "Uploaded the file successfully: " + baseUrl + req.file.originalname,
                });
            } catch (err) {
                console.log(err);
        
                if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size too large!",
                });
                }
        
                res.status(500).send({
                message: `Could not upload the file: ${err}`,
                });
            }
        } else {
            res.status(500).send({
                message: `Unauthorised`,
            });
        }
    });

};

const getListFiles = (req, res) => {  // ROUTE DISABLED (When enabled, needs AUTH on request to work)
    auth(req, res, async function(isAuthorised) {
        if (isAuthorised) {
            const directoryPath = __basedir + "/../resources/static/assets/uploads/";

            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                });
                }

                let fileInfos = [];

                files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: baseUrl + file,
                });
                });

                res.status(200).send(fileInfos);
            });
        } else {
            res.status(500).send({
                message: `Unauthorised`,
            });
        }
    });
};

const download = (req, res) => {
    const fileName = req.params.name
    const directoryPath = __basedir + "/../resources/static/assets/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
        }
    });
};

const remove = (req, res) => {
    auth(req, res, async function(isAuthorised) {
        if (isAuthorised) {
            const fileName = req.params.name
            const directoryPath = __basedir + "/../resources/static/assets/uploads/";

            err = ""
            fs.unlink(directoryPath + fileName, (err) => {
                if (err) {
                    res.status(200).send({
                        message: err,
                    });   
                } else {
                    res.status(200).send({
                        message: "Success!",
                    });   
                }
            });
        } else {
            res.status(200).send({
                message: "Unauthorised!",
            });   
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
    remove,
};