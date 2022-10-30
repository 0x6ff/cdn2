const cors = require("cors");
const express = require("express");
const envy = require('envy');
const app = express();

const env = envy();
const PORT = env.port;
const saltRounds = 13;


global.__basedir = __dirname;

var corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const initRoutes = require("./routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = PORT;
app.listen(port, () => {
	console.log(`Running at localhost:${port}`);
});
