const mysql = require('mysql');

const ketnoi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ql_shopmohinh'
});

ketnoi.connect(function (err) {
    if (err) {
        console.log("Kết nối thất bại)")
    }
});

module.exports = ketnoi;