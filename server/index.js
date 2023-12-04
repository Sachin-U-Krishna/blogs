const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
var { connectdb, disconnectdb } = require("./connection");
var hash = require("./hash");
var mysql = require("mysql");

dotenv.config({
	path: "./.env",
});

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin Permissions
var corsOptions = {
	origin: "*",
	methods: "GET",
	optionsSuccessStatus: 200,
};

// Routes
app.get("/", cors(corsOptions), (req, res) => {
    const con = mysql.createConnection({
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		database: process.env.DATABASE_NAME,
	});
	connectdb(con);
	res.send("Node Running");
    disconnectdb(con);
});

// Error Route
app.get("/*", (req, res) => {
	res.status(404);
	res.send({ Error: "Invalid Path" });
});

// HTTP connection
app.listen(port, () => {
    console.log(`App running at port ${port}`)
});