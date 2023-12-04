var mysql = require('mysql')
const dotenv = require("dotenv");
dotenv.config({
    path: './.env',
});

// Connect with MySql
const connectdb = (connection) => {
    connection.connect((err) => {
        if (err)
            throw (err)
        console.log("MySql Connected\n")
    })
}

const disconnectdb = (connection) => {
    if(connection.state != 'disconnected')
    connection.end((err) => {
        if (err)
            return console.log('error:' + err.message);
        return console.log('Close the database connection.');
    });
}

module.exports = { connectdb, disconnectdb }