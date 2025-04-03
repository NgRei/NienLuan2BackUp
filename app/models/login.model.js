const db = require('../../connect-mySQL').ketnoi;
const bcrypt = require('bcrypt');

class LoginModel {
    static async login(email, password) {
        try {
            // Chỉ lấy user dựa trên email
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ? AND status = 1', 
                [email]
            );
            
            if (!rows[0]) return null;

            // So sánh password với bcrypt
            const match = await bcrypt.compare(password, rows[0].password);
            if (!match) return null;

            return rows[0];
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

module.exports = LoginModel;
