const express = require("express");
const router = express.Router();
const fileController = require("../controller/file.controller");
const authController = require("../controller/auth.controller")

let routes = (app) => {
	router.post("/upload", fileController.upload);
	//router.get("/files", fileController.getListFiles);
	router.get("/files/:name", fileController.download);
	router.delete("/files/:name", fileController.remove);
	router.post("/register", authController.register)

	app.use(router);
};

module.exports = routes;