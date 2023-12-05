const { connectdb, disconnectdb } = require("./connection")
const mysql = require('mysql')

const tables = () => {
    users()
    blogs()
    tags()
}

const users = () => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    connectdb(con)
    con.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ?) as ans;", [process.env.DATABASE_NAME, "users"], async (err, res) => {
        let ans = await res[0].ans
        if (ans == 0) {
            let sql = "CREATE TABLE users (user_id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(80) NOT NULL, username varchar(20) unique NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(150) NOT NULL)";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Users Table created");
            });
        }
        else {
            console.log("Users table exists");
        }
        disconnectdb(con)
    })
}

const blogs = () => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    connectdb(con)
    con.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ?) as ans;", [process.env.DATABASE_NAME, "blogs"], async (err, res) => {
        let ans = await res[0].ans
        if (ans == 0) {
            let sql = "CREATE TABLE blogs ( blog_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), content TEXT, user_id INT, tag_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (tag_id) REFERENCES tags(tag_id), INDEX idx_title (title) );";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Blogs Table created");
            });
        }
        else {
            console.log("Blogs table exists");
        }
        disconnectdb(con)
    })
}

const tags = async () => {
    const con = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME
    });
    connectdb(con)
    
    let createBlogTable = await new Promise((resolve, reject) => {
        con.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ?) as ans;", [process.env.DATABASE_NAME, "tags"], async (err, res) => {
            if (err) reject(err);
            let ans = await res[0].ans
            if (ans == 0) {
                let sql = "CREATE TABLE tags ( tag_id INT PRIMARY KEY AUTO_INCREMENT, tag_name VARCHAR(50) UNIQUE )";
                con.query(sql, function (err, result) {
                    if (err) reject(err);
                    console.log("Tags Table created");
                    resolve(1)
                });
            }
            else {
                resolve(false)
                console.log("Tags table exists");
            }
        })
    });

    if (await createBlogTable) {
        let tableValues = "INSERT INTO tags (tag_name) VALUES ('Trends'), ('Inspiration'), ('Wellness'), ('Adventures'), ('Development'), ('Finance'), ('Reviews'), ('Food'), ('Motivation'), ('DIY'), ('Mindfulness'), ('Fashion'), ('Home'), ('Movies'), ('Living');"
        con.query(tableValues, function (err, result) {
            if (err) throw (err);
            console.log("Tags values inserted");
        });
    }
    else
        disconnectdb(con)
}


module.exports = { tables }