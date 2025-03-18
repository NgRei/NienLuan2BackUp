const ketnoi = require('../../connect-mySQL');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

class CategoryModel {
    async getAll(page = 1, name = '', limit = 4) {
        try {
            let totalRows = 0;
            let _sql_total = "SELECT count(*) as total FROM category";
            if (name) {
                _sql_total += " WHERE name like ?";
            }
            
            let rowdata = await query(_sql_total, name ? [`%${name}%`] : []);
            totalRows = rowdata[0].total;

            let totalpages = Math.max(1, Math.ceil(totalRows / limit));
            page = Math.max(1, Math.min(page, totalpages));
            let _start = (page - 1) * limit;

            let sql = "SELECT id, name, status, CASE WHEN mota IS NULL THEN 'Không có Mô tả' ELSE CONCAT(LEFT(mota, LENGTH(mota) * 0.3), '...') END as mota FROM category";
            if (name) {
                sql += " WHERE name like ?";
            }
            sql += " ORDER BY id DESC LIMIT ?, ?";

            const data = await query(sql, name ? [`%${name}%`, _start, limit] : [_start, limit]);
            return {
                data,
                totalpages,
                currentPage: page,
                totalRows
            };
        } catch (error) {
            throw error;
        }
    }

    async create(categoryData) {
        try {
            // Lấy ID lớn nhất hiện tại
            const result = await query("SELECT MAX(id) as max_id FROM category");
            const new_id = (result[0].max_id || 0) + 1;
            
            // Thêm danh mục mới
            const sql = "INSERT INTO category (id, name, mota, status) VALUES (?, ?, ?, ?)";
            return await query(sql, [new_id, categoryData.name, categoryData.mota, categoryData.status]);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const sql = "DELETE FROM category WHERE id = ?";
            return await query(sql, [id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryModel();
