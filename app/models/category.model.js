const { ketnoi } = require('../../connect-mySQL');

class CategoryModel {
    async getAll(page = 1, name = '', status = '', limit = 4) {
        try {
            console.log('⭐ CategoryModel.getAll called with params:', { page, name, status, limit });
            
            // Câu query đếm tổng số bản ghi
            let countSql = "SELECT count(*) as total FROM category WHERE 1=1";
            let params = [];
            
            if (name) {
                countSql += " AND name LIKE ?";
                params.push(`%${name}%`);
            }
            
            if (status !== '') {
                countSql += " AND status = ?";
                params.push(status);
            }
            
            console.log('Count SQL:', countSql);
            console.log('Count Params:', params);
            
            // Thực hiện query đếm
            let [rows] = await ketnoi.query(countSql, params);
            console.log('Count result:', rows);
            
            const totalRows = rows[0].total;
            
            // Tính toán phân trang
            const totalpages = Math.ceil(totalRows / limit) || 1; // Đảm bảo ít nhất 1 trang
            page = Math.max(1, Math.min(page, totalpages));
            const _start = (page - 1) * limit;
            
            // Quan trọng: Sử dụng các số cụ thể cho LIMIT
            // Đây là cách khắc phục lỗi với mysql2
            const limitSql = ` ORDER BY id DESC LIMIT ${_start}, ${parseInt(limit)}`;
            
            // Query lấy dữ liệu
            let sql = "SELECT * FROM category WHERE 1=1";
            params = []; // Reset params
            
            if (name) {
                sql += " AND name LIKE ?";
                params.push(`%${name}%`);
            }
            
            if (status !== '') {
                sql += " AND status = ?";
                params.push(status);
            }
            
            sql += limitSql;
            
            console.log('Data SQL:', sql);
            console.log('Data Params:', params);
            
            const [data] = await ketnoi.query(sql, params);
            console.log('Data result count:', data.length);
            
            return {
                data,
                totalpages,
                currentPage: page,
                totalRows
            };
        } catch (error) {
            console.error('❌ Error in CategoryModel.getAll:', error);
            throw error;
        }
    }

    async getAllNoLimit() {
        try {
            const [data] = await ketnoi.query('SELECT * FROM category ORDER BY id DESC');
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy tất cả danh mục:', error);
            return [];
        }
    }

    async showCategory() {
        try {
            const [rows] = await ketnoi.query('SELECT * FROM category ORDER BY id DESC');
            return rows;
        } catch (err) {
            console.error('Lỗi khi lấy danh mục:', err);
            return [];
        }
    }

    async create(categoryData) {
        try {
            const [result] = await ketnoi.execute("SELECT MAX(id) as max_id FROM category");
            const new_id = (result[0].max_id || 0) + 1;

            const mota = categoryData.mota?.trim() || null;

            const [insertResult] = await ketnoi.execute(
                "INSERT INTO category (id, name, mota, status) VALUES (?, ?, ?, ?)",
                [new_id, categoryData.name, mota, categoryData.status]
            );
            return insertResult;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const [rows] = await ketnoi.execute("SELECT * FROM category WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async update(id, categoryData) {
        try {
            const [result] = await ketnoi.execute(
                "UPDATE category SET name = ?, mota = ?, status = ? WHERE id = ?",
                [categoryData.name, categoryData.mota || null, categoryData.status, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const [result] = await ketnoi.execute("DELETE FROM category WHERE id = ?", [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryModel();
