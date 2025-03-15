const express = require('express');
const ketnoi = require('./connect-mySQL');
const app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/danh-muc', function (req, res) {
    ketnoi.query("SELECT * FROM category order by id ASC", function (err, data) {
        res.render('category', {
            title: '<b>Quản lý danh mục</b>',
            data: data,
            totalpages: 10
        });
    });
});

app.get('/them-danh-muc', function (req, res) {
    res.render('add-category');
});

app.get('/xoa-danh-muc/:id', function (req, res) {
    let id = req.params.id;
    let sql_delete = "DELETE FROM category WHERE id = ?";
    ketnoi.query(sql_delete, [id], function (err, data) {
        res.redirect('/danh-muc');
    });
});

app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the app`);
});
