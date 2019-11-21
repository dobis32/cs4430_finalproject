const mysql = require('mysql');
const connection = function(){
    const db = mysql.createConnection({
        host:'localhost',
        user:'dobis32',
        password:'@AsdF333#$%',
        database:'buyndrive'
    });
    db.connect();
    return db;
}

module.exports = connection