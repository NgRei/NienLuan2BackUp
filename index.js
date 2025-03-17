const express = require('express');
const ketnoi = require('./connect-mySQL');
const util = require('node:util');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
const query = util.promisify(ketnoi.query).bind(ketnoi);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/danh-muc', async function (req, res) {
    try {
        let _name = req.query.name;
        // Lấy số trang hiện tại
        let _page = req.query.page ? parseInt(req.query.page) : 1;
        let totalRows = 0;

        // Truy vấn lấy tổng số dòng trong bảng
        let _sql_total = "SELECT count(*) as total FROM category";
        if (_name) {
            _sql_total += " WHERE name like ?";
        }

        let rowdata = await query(_sql_total, _name ? [`%${_name}%`] : []);
        totalRows = rowdata[0].total;

        let _limit = 4;
        let totalpages = Math.max(1, Math.ceil(totalRows / _limit));
        _page = Math.max(1, Math.min(_page, totalpages));
        let _start = (_page - 1) * _limit;

        let sql = "SELECT id, name, status, CASE WHEN mota IS NULL THEN 'Không có Mô tả' ELSE CONCAT(LEFT(mota, LENGTH(mota) * 0.3), '...') END as mota FROM category";
        if (_name) {
            sql += " WHERE name like ?";
        }
        sql += " ORDER BY id DESC LIMIT ?, ?";

        let data = await query(sql, _name ? [`%${_name}%`, _start, _limit] : [_start, _limit]);

        res.render('category', {
            title: '<b>Quản lý danh mục</b>',
            data: data || [],
            totalpages: totalpages,
            _page: _page,
            _name: _name || '',
        });
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
        res.render('category', {
            title: '<b>Quản lý danh mục</b>',
            data: [],
            totalpages: 1,
            _page: 1,
            _name: _name || '',
            error: 'Có lỗi xảy ra khi tải dữ liệu'
        });
    }
});

app.get('/them-danh-muc', function (req, res) {
    res.render('add-category');
});

app.post('/them-danh-muc', function (req, res) {
    // Lấy ID lớn nhất hiện tại
    let sql_get_max_id = "SELECT MAX(id) as max_id FROM category";
    ketnoi.query(sql_get_max_id, function(err, result) {
        if (err) {
            console.log('Lỗi lấy ID:', err);
            res.render('add-category', {
                error: 'Lỗi khi thêm danh mục'
            });
            return;
        }

        // Tạo ID mới bằng cách tăng ID lớn nhất lên 1
        let new_id = (result[0].max_id || 0) + 1;
        
        // Thêm danh mục mới với ID đã tính
        let sql = "INSERT INTO category (id, name, mota, status) VALUES (?, ?, ?, ?)";
        ketnoi.query(sql, [new_id, req.body.name, req.body.mota, req.body.status], function (err, data) {
            if (err) {
                console.log('Lỗi thêm danh mục:', err);
                let errorMsg = 'Lỗi khi thêm danh mục';
                if (err.code === 'ER_DUP_ENTRY') {
                    errorMsg = 'Không thể thêm danh mục. Danh mục bạn vừa thêm mới đã tồn tại !!';
                }
                res.render('add-category', {
                    error: errorMsg
                });
            } else {
                res.redirect('/danh-muc');
            }
        });
    });
});

app.get('/xoa-danh-muc/:id', function (req, res) {
    let id = req.params.id;
    let sql_delete = "DELETE FROM category WHERE id = ?";
    ketnoi.query(sql_delete, [id], function (err, data) {
        if (err) {
            let msg = '';
            if (err.errno == 1451) {
                msg = 'Không thể xóa danh mục này vì có sản phẩm thuộc danh mục này';
            }
            else {
                msg = 'Lỗi không xác định';
            }
        }
        else {
            res.redirect('/danh-muc');
        }
    });
});

app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the app`);
});
