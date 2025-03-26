const CategoryModel = require('../../models/category.model');

class EditCategoryController {

    showForm(req, res) {
        res.render('category/add');
    }

    // Hiển thị trang chỉnh sửa danh mục
    async showFormEdit(req, res) {
        try {
            const category = await CategoryModel.findById(req.params.id);
            res.render('category/edit', {
                category
            });
        } catch (err) {
            console.log('Lỗi hiển thị trang chỉnh sửa danh mục:', err);
            res.redirect('/danh-muc');
        }
    }

    // Xử lý chỉnh sửa danh mục
    async update(req, res) {
        try {
            await CategoryModel.update(req.params.id, req.body);
            res.redirect('/danh-muc');
        } catch (err) {
            console.log('Lỗi chỉnh sửa danh mục:', err);
            res.redirect('/danh-muc');
        }
    }
}
module.exports = new EditCategoryController();