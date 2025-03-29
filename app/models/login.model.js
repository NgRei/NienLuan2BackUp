const db = require('../../connect-mySQL').ketnoi;

class LoginModel {
    static async login(email, password, role) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND status = 1', [email, password, role]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}
module.exports = LoginModel;
