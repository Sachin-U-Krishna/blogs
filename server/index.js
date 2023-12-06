const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const tables = require("./tables");
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

var con;

const handleDisconnect = () => {
    con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });


    con.connect((err) => {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', (err) => {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();


// Login Route
app.post('/login', async (req, res) => {

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
})

app.post('/verify', async (req, res) => {

    const { auth, auth2 } = req.body
    let hashedID = hash.cryptoDecrypt(await auth)
    let hashedPass = hash.cryptoDecrypt(await auth2)
    con.query("SELECT * from users where user_id=? and password=?", [hashedID, hashedPass], async (err, result) => {
        if (await result.length)
            res.send({ result: 1, message: 'authenticated', auth, auth2 });
        else
            res.send({ result: 0, message: 'failed' });
    })
})

// signup
app.post('/signup', async (req, res) => {

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
            return res.send({ result: 1, message: 'Success' });

        })
    }
})

// get tag
app.get('/get-tags', async (req, res) => {


    con.query("SELECT * from tags order by tag_id", async (err, result) => {
        if (await result.length > 0)
            res.send({ result: 1, tags: result });
        else
            res.send({ result: 0, message: 'failed' });
    })
})

app.post('/create-blog', async (req, res) => {


    const { title, content, tagId, auth } = req.body
    let deHashedID = hash.cryptoDecrypt(await auth)

    con.query("INSERT into blogs SET ?", {
        title,
        content,
        tag_id: tagId,
        user_id: deHashedID
    }, async (err, result) => {
        if (err)
            return res.send({ result: 0, error_code: 404, message: err.sqlMessage });
        return res.send({ result: 1, message: 'Success' });
    })
});

app.post('/edit-blog', async (req, res) => {


    const { title, content, tagId, auth } = req.body
    let deHashedID = hash.cryptoDecrypt(await auth)

    con.query("Update blogs SET title=?, content=?, tag_id=? where user_id=?", [title, content, tagId, deHashedID], async (err, result) => {
        if (err)
            return res.send({ result: 0, error_code: 404, message: err.sqlMessage });
        return res.send({ result: 1, message: 'Success' });
    })
});

app.get('/get-blogs', async (req, res) => {


    con.query("SELECT u.username, b.title, t.tag_name, b.created_at as blog_date, b.content FROM blogs b JOIN users u ON b.user_id = u.user_id JOIN tags t ON b.tag_id = t.tag_id ORDER BY b.created_at DESC;", async (err, result) => {
        if (await result.length > 0)
            res.send({ result: 1, blogs: result });
        else
            res.send({ result: 0, message: 'failed' });
    })
})

app.post('/delete-my-blog', async (req, res) => {


    const { auth, id } = req.body
    let deHashedID = hash.cryptoDecrypt(await auth)

    con.query("DELETE from blogs where blog_id=? and user_id=?", [id, deHashedID], async (err, result) => {
        if (await result.affectedRows > 0)
            res.send({ result: 1, message: 'success' });
        else
            res.send({ result: 0, message: 'failed' });
    })
})

app.post('/get-my-blogs', async (req, res) => {


    const { auth } = req.body
    let deHashedID = hash.cryptoDecrypt(await auth)

    con.query("SELECT u.username, b.title, t.tag_name,t.tag_id, b.created_at as blog_date,b.blog_id, b.content FROM blogs b JOIN users u ON b.user_id = u.user_id JOIN tags t ON b.tag_id = t.tag_id WHERE u.user_id = ? ORDER BY b.created_at DESC;", [deHashedID], async (err, result) => {
        if (await result.length > 0)
            res.send({ result: 1, blogs: result });
        else
            res.send({ result: 0, message: 'failed' });
    })
})

// Routes
app.get("/", (req, res) => {
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