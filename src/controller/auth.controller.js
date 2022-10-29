const bcrypt = require('bcrypt');
const mysql = require('mysql'); 
const envy = require('envy');
const fs = require("fs");

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

const register = async function(req,res){
	if (req.body.reg_token != REGISTER_TOKEN) {
		res.send({
			"code":500,
			"Failed": "Error occurred",
			"error": "Wrong register token!"
		})
		return;
	}

	const saltRounds = 10;
	const password = req.body.user_pw;
	var encryptedPassword; 
	try {
		encryptedPassword = await bcrypt.hash(password, saltRounds)
	} catch (e) {
		res.send({
			"code":500,
			"Failed": "Error occurred",
			"error": "Missing data"
		})
		return;
	}


	let user = {       
		"user_name": req.body.user_name,
		"user_nick": req.body.user_nick,
		"user_pw_hash": encryptedPassword,
	}
	
	let sql = "INSERT INTO USERS SET ?"

	con.query(sql, user, function (err, results, fields) {
		if (err) { 
			if (err.code == "ER_DUP_ENTRY") {
				res.send({
					"code":500,
					"Failed": "Error occurred",
					"error": "Username already registered"
				})
				return;
			}
			res.send({
				"code": 500,
				"Failed": "Error occurred",
				"error": err.code
			})
			return;
		} else {
			res.send({          
				"code": 200,          
				"Success": "User registered sucessfully"            
			});
			console.log("User " + user.user_name + " registered!")
		}    
	});
}

module.exports = {
	register
};