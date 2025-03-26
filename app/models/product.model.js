const { ketnoi } = require('../../connect-mySQL');

class ProductModel {
    async getAll(page = 1, name = '', status = '', category_id = '', manufacturer = '', origin = '', year = '', limit = 4) {
        try {
            let totalRows = 0;
            let _sql_total = "SELECT count(*) as total FROM product WHERE 1=1";
            let params = [];

            if (name) {
                _sql_total += " AND product.name LIKE ?";
                params.push(`%${name}%`);
            }

            if (status) {
                _sql_total += " AND product.status = ?";
                params.push(status);
            }

            if (category_id) {
                _sql_total += " AND product.category_id = ?";
                params.push(category_id);
            }

            if (manufacturer) {
                _sql_total += " AND product.hang_san_xuat = ?";
                params.push(manufacturer);
            }

            if (origin) {
                _sql_total += " AND product.noi_xuat_xu = ?";
                params.push(origin);
            }

            if (year) {
                _sql_total += " AND product.nam_san_xuat = ?";
                params.push(year);
            }

            // let rowdata = await query(_sql_total, params);
            // totalRows = rowdata[0].total;
            let [rowdata] = await ketnoi.query(_sql_total, params);
            totalRows = rowdata[0].total;

            let totalpages = Math.max(1, Math.ceil(totalRows / limit));
            page = Math.max(1, Math.min(page, totalpages));
            let _start = (page - 1) * limit;

            let sql = `
                SELECT 
                    product.id, 
                    product.name, 
                    category.name AS category_name, 
                    product.gia, 
                    product.so_luong, 
                    product.hang_san_xuat, 
                    product.noi_xuat_xu, 
                    product.nam_san_xuat, 
                    product.hinh_anh, 
                    product.status, 
                    CASE 
                        WHEN product.mota IS NULL THEN 'Không có Mô tả' 
                        ELSE CONCAT(LEFT(product.mota, CHAR_LENGTH(product.mota) / 100 ), '...')
                    END as mota 
                FROM product
                LEFT JOIN category ON product.category_id = category.id
                WHERE 1=1
            `;

            if (name) {
                sql += " AND product.name LIKE ?";
            }

            if (status) {
                sql += " AND product.status = ?";
            }

            if (category_id) {
                sql += " AND product.category_id = ?";
            }

            if (manufacturer) {
                sql += " AND product.hang_san_xuat = ?";
            }

            if (origin) {
                sql += " AND product.noi_xuat_xu = ?";
            }

            if (year) {
                sql += " AND product.nam_san_xuat = ?";
            }

            sql += " ORDER BY product.id DESC LIMIT ?, ?";
            params.push(_start, limit);

            // const data = await query(sql, params);
            const [data] = await ketnoi.query(sql, params);
            return {
                data,
                totalpages,
                currentPage: page,
                totalRows,
            };
        } catch (error) {
            throw error;
        }
    }

    async create(productData) {
        try {
            // Lấy ID lớn nhất hiện tại
            const [result] = await ketnoi.query("SELECT MAX(id) as max_id FROM product");
            const new_id = (result[0].max_id || 0) + 1;

            // Kiểm tra nếu "mota" bị để trống hoặc chỉ chứa dấu cách
            const mota = productData.mota && productData.mota.trim() !== '' ? productData.mota : null;

            // Thêm sản phẩm mới
            const sql = `
                INSERT INTO product (
                    id, 
                    name, 
                    category_id, 
                    gia, 
                    so_luong, 
                    hang_san_xuat, 
                    noi_xuat_xu, 
                    nam_san_xuat, 
                    mota, 
                    hinh_anh, 
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                new_id,
                productData.name || null,
                productData.category_id || null,
                productData.gia || null,
                productData.so_luong || null,
                productData.hang_san_xuat || null,
                productData.noi_xuat_xu || null,
                productData.nam_san_xuat || null,
                mota,
                productData.hinh_anh || null,
                productData.status || 0
            ];
            const [anotherresult] = await ketnoi.query(sql, params);
            return anotherresult;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        //     try {
        //         const sql = `
        //     SELECT 
        //         product.id,
        //         product.name, 
        //         product.category_id, 
        //         product.gia, 
        //         product.so_luong, 
        //         product.hang_san_xuat, 
        //         product.noi_xuat_xu, 
        //         product.nam_san_xuat, 
        //         product.hinh_anh, 
        //         product.status, 
        //         product.mota
        //     FROM product
        //     WHERE product.id = ?
        // `;
        //         // const result = await query(sql, [id]);
        //         // return result[0];
        //         const [result] = await ketnoi.query(sql, [id]);
        //         return result[0];
        try {
            const sql = 'SELECT * FROM product WHERE id = ?';
            const [rows] = await ketnoi.query(sql, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async update(id, productData) {
        try {
            const sql = `
                UPDATE product 
                SET 
                    name = ?, 
                    category_id = ?, 
                    gia = ?, 
                    so_luong = ?, 
                    hang_san_xuat = ?, 
                    noi_xuat_xu = ?, 
                    nam_san_xuat = ?, 
                    hinh_anh = ?, 
                    mota = ?, 
                    status = ? 
                WHERE id = ?
            `;
            const params = [
                productData.name,
                productData.category_id,
                productData.gia,
                productData.so_luong,
                productData.hang_san_xuat,
                productData.noi_xuat_xu,
                productData.nam_san_xuat,
                productData.hinh_anh,
                productData.mota,
                productData.status,
                id
            ];
            const [result] = await ketnoi.query(sql, params);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        const sql = `
            SELECT * 
            FROM product 
            WHERE id = ?
        `;
        // const result = await query(sql, [id]);
        // return result[0];
        const [result] = await ketnoi.query(sql, [id]);
        return result[0];
    }

    async delete(id) {
        try {
            // const sql = "DELETE FROM product WHERE id = ?";
            // return await query(sql, [id]);
            const [result] = await ketnoi.query("DELETE FROM product WHERE id = ?", [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductModel();