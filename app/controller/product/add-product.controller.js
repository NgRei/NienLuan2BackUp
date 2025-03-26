const ProductModel = require('../../models/product.model');
const CategoryModel = require('../../models/category.model');

class AddProductController {
    // Hiển thị form thêm sản phẩm
    async showForm(req, res) {
        try {
            // Sử dụng phương thức mới để lấy tất cả danh mục
            const categories = await CategoryModel.getAllNoLimit();
            
            res.render('product/add', { 
                category: categories,
                error: null 
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            res.render('product/add', { 
                category: [], 
                error: 'Không thể tải danh mục' 
            });
        }
    }

    // Xử lý thêm sản phẩm 
    async create(req, res) {
        try {
            const categoryExists = await CategoryModel.findById(req.body.category_id);
            if (!categoryExists) {
                throw new Error('Danh mục không tồn tại. Vui lòng chọn danh mục hợp lệ.');
            }
            if (!req.body.category_id) {
                throw new Error('Danh mục không được để trống');
            }
            if (!['Bandai', 'Banpresto'].includes(req.body.hang_san_xuat)) {
                throw new Error('Hãng sản xuất không hợp lệ');
            }

            if (!['Việt Nam', 'Nhật Bản', 'Trung Quốc'].includes(req.body.noi_xuat_xu)) {
                throw new Error('Nơi xuất xứ không hợp lệ');
            }

            const productData = {
                ...req.body,
                hinh_anh: req.file ? req.file.filename : null,
            };
            await ProductModel.create(productData);
            res.redirect('/san-pham');
        } catch (err) {
            console.log('Lỗi thêm sản phẩm:', err);
            let errorMsg = 'Lỗi khi thêm sản phẩm';
            if (err.code === 'ER_DUP_ENTRY') {
                errorMsg = 'Không thể thêm sản phẩm. Sản phẩm bạn vừa thêm mới đã tồn tại !!';
            } else if (err.message) {
                errorMsg = err.message;
            }

            // Sử dụng phương thức mới khi có lỗi
            const categories = await CategoryModel.getAllNoLimit();
            
            res.render('product/add', {
                error: errorMsg,
                category: categories
            });
        }
    }
}

module.exports = new AddProductController();
