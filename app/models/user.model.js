const db = require('../../connect-mySQL').ketnoi;
const bcrypt = require('bcrypt');

class UserModel {
    constructor(username, password, email, full_name, phone, address, role) {
        this.username = username;
        this.password = password;
        this.original_password = password;
        this.email = email;
        this.full_name = full_name;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

    static async search(searchTerm, role) {
        try {
            let query = 'SELECT * FROM users WHERE status = 1';
            const params = [];

            if (searchTerm) {
                query += ' AND (username LIKE ? OR full_name LIKE ? OR email LIKE ?)';
                const searchPattern = `%${searchTerm}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }

            if (role && role !== 'all') {
                query += ' AND role = ?';
                params.push(role);
            }

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error in search:', error);
            throw error;
        }
    }

    async save() {
        try {
            // Lấy ID lớn nhất hiện tại
            const [maxId] = await db.query('SELECT MAX(id) as maxId FROM users WHERE status = 1');
            const nextId = (maxId[0].maxId || 0) + 1;
            
            // Reset auto increment
            await db.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextId]);
            
            // Thêm user mới
            const [result] = await db.query(
                'INSERT INTO users (username, password, original_password, email, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [this.username, this.password, this.original_password, this.email, this.full_name, this.phone, this.address, this.role]
            );
            
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(
                `SELECT id, username, email, full_name, phone, address, role, status, created_at 
                 FROM users 
                 WHERE id = ? AND status = 1`,
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Find user by ID error:', error);
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            // Tìm user bằng username hoặc email
            const [rows] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND status = 1', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, userData) {
        try {
            const [result] = await db.query(
                'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, role = ? WHERE id = ?',
                [userData.username, userData.email, userData.full_name, userData.phone, userData.address, userData.role, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            return result;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    static async updatePassword(userId, hashedPassword, originalPassword) {
        try {
            const [result] = await db.query(
                `UPDATE users 
                 SET password = ?, 
                     original_password = ?
                 WHERE id = ? AND status = 1`,
                [hashedPassword, originalPassword, userId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Không thể cập nhật mật khẩu');
            }

            return true;
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    }

    static async getAll(page = 1, limit = 5, searchTerm = '', role = '') {
        try {
            let query = 'SELECT * FROM users WHERE status = 1';
            const params = [];

            if (searchTerm) {
                query += ' AND (username LIKE ? OR full_name LIKE ? OR email LIKE ?)';
                const searchPattern = `%${searchTerm}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }

            if (role && role !== 'all') {
                query += ' AND role = ?';
                params.push(role);
            }

            // Thêm đếm tổng số records
            const [countResult] = await db.query(
                query.replace('*', 'COUNT(*) as total'),
                params
            );
            const total = countResult[0].total;

            // Thêm phân trang
            query += ' ORDER BY id ASC LIMIT ? OFFSET ?';
            const offset = (page - 1) * limit;
            params.push(limit, offset);

            const [rows] = await db.query(query, params);

            return {
                data: rows,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            };
        } catch (error) {
            throw error;
        }
    }

    static async login(username, password) {
        try {
            const user = await this.findByUsername(username);
            
            if (!user) {
                return null;
            }
            
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return null;
            }
            
            // Chỉ trả về user nếu có role là admin và trạng thái active
            if (user.role === 'admin' && user.status === 1) {
                return user;
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async updateProfile(userId, data) {
        try {
            const { full_name, email, phone, address } = data;
            
            // Log để debug
            console.log('Updating profile with data:', { userId, full_name, email, phone, address });
            
            const [result] = await db.query(
                `UPDATE users 
                 SET full_name = ?, 
                     email = ?, 
                     phone = ?, 
                     address = ?
                 WHERE id = ? AND status = 1`,
                [full_name, email, phone, address, userId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Không thể cập nhật thông tin người dùng');
            }

            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
}

module.exports = UserModel; 
