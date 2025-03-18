const CategoryModel = require('../models/caterogy.model');

class CategoryController {
    async index(req, res) {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const name = req.query.name || '';
            
            const result = await CategoryModel.getAll(page, name);
            
            res.render('category/index', {
                title: '<b>Quản lý danh mục</b>',
                data: result.data || [],
                totalpages: result.totalpages,
                _page: result.currentPage,
                _name: name,
            });
        } catch (err) {
            console.error('Lỗi truy vấn:', err);
            res.render('category/index', {
                title: '<b>Quản lý danh mục</b>',
                data: [],
                totalpages: 1,
                _page: 1,
                _name: '',
                error: 'Có lỗi xảy ra khi tải dữ liệu'
            });
        }
    }

    showAddForm(req, res) {
        res.render('category/add');
    }

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

    async delete(req, res) {
        try {
            await CategoryModel.delete(req.params.id);
            res.redirect('/danh-muc');
        } catch (err) {
            let msg = '';
            if (err.errno == 1451) {
                msg = 'Không thể xóa danh mục này vì có sản phẩm thuộc danh mục này';
            } else {
                msg = 'Lỗi không xác định';
            }
            // Có thể thêm xử lý hiển thị lỗi tại đây
            res.redirect('/danh-muc');
        }
    }
}

module.exports = new CategoryController();
