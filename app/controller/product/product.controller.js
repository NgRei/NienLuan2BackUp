const ProductModel = require('../../models/product.model');
const fs = require('fs');
const path = require('path');
const CategoryModel = require('../../models/category.model'); // Ensure you have a CategoryModel to fetch categories
const { ketnoi } = require('../../../connect-mySQL');

class ProductController {
    async index(req, res) {
        try {
            // Lấy các tham số từ query
            const page = parseInt(req.query.page) || 1;
            const name = req.query.name || '';
            const status = req.query.status || '';
            const category_id = req.query.category_id || '';
            const manufacturer = req.query.manufacturer || '';  // hãng sản xuất
            const origin = req.query.origin || '';             // nơi xuất xứ
            const year = req.query.year || '';                 // năm sản xuất
            
            // Lấy dữ liệu sản phẩm với tất cả tham số lọc
            const result = await ProductModel.getAll(
                page, name, status, category_id, manufacturer, origin, year
            );
            
            // Lấy danh sách danh mục để hiển thị trong form lọc
            const categoryResult = await CategoryModel.getAll();
            
            res.render('product/index', {
                data: result.data,
                currentPage: result.currentPage,
                totalpages: result.totalpages,
                totalRows: result.totalRows,
                // Truyền lại tất cả tham số lọc để giữ trạng thái
                _name: name,
                _status: status,
                _category_id: category_id,
                _manufacturer: manufacturer,
                _origin: origin,
                _year: year,
                categories: categoryResult.data
            });
        } catch (error) {
            console.error('Lỗi khi tải danh sách sản phẩm:', error);
            res.render('product/index', {
                data: [],
                currentPage: 1,
                totalpages: 1,
                totalRows: 0,
                _name: '',
                _status: '',
                _category_id: '',
                _manufacturer: '',
                _origin: '',
                _year: '',
                categories: [],
                error: 'Không thể tải danh sách sản phẩm'
            });
        }
    }

    showAddForm(req, res) {
        res.render('product/add');
    }

    async delete(req, res) {
        try {
            const product = await ProductModel.getById(req.params.id); // Lấy thông tin sản phẩm
            if (product && product.hinh_anh) {
                const filePath = path.join(__dirname, '../../uploads', product.hinh_anh);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('Tệp ảnh đã được xóa:', filePath); // Xóa tệp ảnh khỏi thư mục uploads
                } else {
                    console.log('Tệp ảnh không tồn tại:', filePath);
                }
            }
            await ProductModel.delete(req.params.id);
            res.redirect('/san-pham'); // Chuyển hướng về danh sách sản phẩm nếu xóa thành công
        } catch (err) {
            if (err.errno === 1451) { // Lỗi ràng buộc khóa ngoại
                res.render('error', {
                    message: 'Không thể xóa sản phẩm này vì có ràng buộc liên quan.',
                    error: {}
                });
            } else {
                console.error('Lỗi không xác định:', err);
                res.render('error', {
                    message: 'Đã xảy ra lỗi không xác định.',
                    error: err
                });
            }
        }
    }
}

module.exports = new ProductController();