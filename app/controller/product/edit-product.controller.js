const ProductModel = require('../../models/product.model');
const CategoryModel = require('../../models/category.model'); // Import model danh mục

class EditProductController {

    showForm(req, res) {
        res.render('product/add');
    }

    // Hiển thị trang chỉnh sửa danh mục
    async showFormEdit(req, res) {
        try {
            const id = req.params.id;
            const product = await ProductModel.findById(id);
            
            if (!product) {
                return res.redirect('/san-pham');
            }
            
            // Sử dụng getAllNoLimit thay vì getAll để lấy tất cả danh mục
            const categories = await CategoryModel.getAllNoLimit();
            
            res.render('product/edit', {
                product,
                categories, // Truyền danh sách đầy đủ danh mục
                error: null
            });
        } catch (error) {
            console.error('Lỗi khi hiển thị form chỉnh sửa:', error);
            res.redirect('/san-pham');
        }
    }

    // Xử lý chỉnh sửa danh mục
    async update(req, res) {
        try {
            const id = req.params.id;
            const currentProduct = await ProductModel.getById(id);
            if (!currentProduct) {
                throw new Error('Không tìm thấy sản phẩm để chỉnh sửa');
            }

            // In ra toàn bộ dữ liệu form để kiểm tra
            console.log('Form data:', req.body);
            
            // Giữ category_id hiện tại nếu không có giá trị mới
            const categoryId = req.body.category_id 
                ? parseInt(req.body.category_id, 10) 
                : currentProduct.category_id;
            
            // Log để debug
            console.log('Sử dụng category_id:', categoryId);
            
            if (!categoryId) {
                throw new Error('Vui lòng chọn danh mục cho sản phẩm');
            }
            
            const categoryExists = await CategoryModel.findById(categoryId);
            console.log('Kết quả tìm kiếm danh mục:', categoryExists);
            
            if (!categoryExists) {
                throw new Error('Danh mục không tồn tại. Vui lòng chọn danh mục hợp lệ.');
            }

            // Kiểm tra hang_san_xuat và có lỗi rõ ràng hơn
            if (!req.body.hang_san_xuat) {
                throw new Error('Hãng sản xuất không được để trống');
            }
            
            if (!['Bandai', 'Banpresto'].includes(req.body.hang_san_xuat)) {
                throw new Error(`Hãng sản xuất không hợp lệ. Chỉ chấp nhận: Bandai hoặc Banpresto. Giá trị nhận được: "${req.body.hang_san_xuat}"`);
            }

            if (!['Việt Nam', 'Nhật Bản', 'Trung Quốc'].includes(req.body.noi_xuat_xu)) {
                throw new Error('Nơi xuất xứ không hợp lệ');
            }

            // Cập nhật sản phẩm
            const productData = {
                ...req.body,
                category_id: categoryId,
                hinh_anh: req.file ? req.file.filename : currentProduct.hinh_anh
            };

            await ProductModel.update(id, productData);
            res.redirect('/san-pham');
        } catch (err) {
            console.log('Lỗi chỉnh sửa sản phẩm:', err);
            
            // Lấy lại thông tin sản phẩm và TẤT CẢ danh mục
            const product = await ProductModel.getById(req.params.id);
            const categories = await CategoryModel.getAllNoLimit();
            
            res.render('product/edit', {
                product,
                categories, // Truyền tất cả danh mục
                error: err.message
            });
        }
    }
}
module.exports = new EditProductController();