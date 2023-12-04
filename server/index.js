const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const tables = require("./tables");
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

// Auto create tables
tables.tables();

// Login Route
app.post('/login', cors(corsOptions), async (req, res) => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    connectdb(con)
    const { email, password } = req.body;

    con.query("SELECT * from users where email=?", [email], async (err, result) => {
        if (err)
            res.send({ result: 0, error_code: 404, message: err.sqlMessage });

        const emailUsers = await result

        if (emailUsers.length) {
            const decodePass = await hash.decode(password, emailUsers[0].password)
            if (decodePass) {
                let hashedID = hash.cryptoEncrypt(await emailUsers[0].user_id)
                let hashedPass = hash.cryptoEncrypt(await emailUsers[0].password)
                res.send({ result: 1, message: 'authenticated', auth: hashedID, auth2: hashedPass });
            }
            else
                res.send({ result: 0, message: 'Invalid Password' });
        }
        else
            res.send({ result: 0, message: 'Invalid email' });
    })
    disconnectdb(con)
})

app.post('/verify', async (req, res) => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    const { auth, auth2 } = req.body
    let hashedID = hash.cryptoDecrypt(await auth)
    let hashedPass = hash.cryptoDecrypt(await auth2)
    con.query("SELECT * from users where user_id=? and password=?", [hashedID, hashedPass], async (err, result) => {
        const users = await result
        if (result.length)
            res.send({ result: 1, message: 'authenticated', auth, auth2 });
        else
            res.send({ result: 0, message: 'failed' });
    })
    disconnectdb(con)
})

// signup
app.post('/signup', cors(corsOptions), async (req, res) => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    connectdb(con)
    const { full_name, email, password, username } = req.body;

    if (!full_name || !email || !password || !username)
        return res.send({ result: 0, message: 'Empty Fields' });

    const checkEmail = await new Promise((resolve, reject) => {
        con.query("SELECT * from users where email=?", [email], (err, result) => {
            if (err)
                reject(err);

            if (result.length)
                resolve(false)
            else
                resolve(true)
        })
    })

    const checkUsername = await new Promise((resolve, reject) => {
        con.query("SELECT * from users where username=?", [username], (err, result) => {
            if (err)
                reject(err);

            if (result.length)
                resolve(false)
            else
                resolve(true)
        })
    })

    if (!checkEmail)
        return res.send({ result: 0, message: 'Email already exists' });
    else if (!checkUsername)
        return res.send({ result: 0, message: 'Username already exists' });
    else {
        const hashpass = await hash.encode(password)
        con.query("INSERT into users SET ?", {
            full_name,
            email,
            password: hashpass,
            username
        }, async (err, result) => {
            if (err)
                return res.send({ result: 0, error_code: 404, message: err.sqlMessage });
			console.log(result)
			return res.send({ result: 1, message: 'Success' });

        })
    }
    setTimeout(()=>disconnectdb(con),10000)
})

// Routes
app.get("/", cors(corsOptions), (req, res) => {
	res.status(200).send('<p>Node Running</p>');
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