const CategoryModel = require('../../models/category.model');
const { ketnoi } = require('../../../connect-mySQL');

class CategoryController {
    async index(req, res) {
        try {
            console.log('========== CATEGORY INDEX START ==========');
            console.log('Request received for category index');
            
            const page = parseInt(req.query.page) || 1;
            const name = req.query.name || '';
            const status = req.query.status || '';
            
            console.log('Query params:', { page, name, status });
            
            console.log('Calling CategoryModel.getAll()');
            const result = await CategoryModel.getAll(page, name, status);
            console.log('CategoryModel.getAll() returned with data count:', result.data?.length);
            
            console.log('Rendering category/index view');
            res.render('category/index', {
                data: result.data || [],
                _page: result.currentPage,
                totalpages: result.totalpages,
                totalRows: result.totalRows,
                _name: name,
                _status: status,
                error: null
            });
            console.log('========== CATEGORY INDEX END ==========');
        } catch (error) {
            console.error('ERROR IN CATEGORY INDEX:', error);
            
            res.render('category/index', {
                data: [],
                _page: 1,
                totalpages: 1,
                totalRows: 0,
                _name: '',
                _status: '',
                error: 'Không thể tải danh sách danh mục: ' + error.message
            });
        }
    }

    showAddForm(req, res) {
        res.render('category/add');
    }

    async delete(req, res) {
        try {
            const categoryId = req.params.id;
            await CategoryModel.delete(categoryId);

            // Cập nhật lại các id
            await ketnoi.execute(
                "UPDATE category SET id = id - 1 WHERE id > ?",
                [categoryId]
            );

            await ketnoi.execute("ALTER TABLE category AUTO_INCREMENT = 1");

            res.redirect('/danh-muc');
        } catch (err) {
            console.error('Lỗi khi xóa danh mục:', err);
            if (err.errno === 1451) {
                res.render('error', {
                    message: 'Không thể xóa danh mục này vì có sản phẩm thuộc danh mục này.',
                    error: {}
                });
            } else {
                res.render('error', {
                    message: 'Đã xảy ra lỗi khi xóa danh mục.',
                    error: err
                });
            }
        }
    }
}

module.exports = new CategoryController();
