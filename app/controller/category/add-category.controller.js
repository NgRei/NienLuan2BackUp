const CategoryModel = require('../../models/category.model');

class AddCategoryController {
    // Hiển thị form thêm danh mục
    showForm(req, res) {
        res.render('category/add');
    }

    // Xử lý thêm danh mục
    async create(req, res) {
        try {
            
            await CategoryModel.create(req.body);
            res.redirect('/danh-muc');
        } catch (err) {
            console.log('Lỗi thêm danh mục:', err);
            let errorMsg = 'Lỗi khi thêm danh mục';
            if (err.code === 'ER_DUP_ENTRY') {
                errorMsg = 'Không thể thêm danh mục. Danh mục bạn vừa thêm mới đã tồn tại !!';
            }
            res.render('category/add', {
                error: errorMsg
            });
        }
    }
}

module.exports = new AddCategoryController();
