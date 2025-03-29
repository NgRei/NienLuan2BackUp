const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');


class LoginController {
    static async showLoginForm(req, res) {
        res.render('login', { error: undefined });
    }

    static async handleLogin(req, res) {
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                return res.status(400).render('login', { error: 'Vui lòng nhập đầy đủ thông tin đăng nhập' });
            }

            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(400).render('login', { error: 'Tài khoản không tồn tại' });
            }   

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).render('login', { error: 'Mật khẩu không chính xác' });
            }

            if (user.role !== 'admin') {
                return res.status(403).render('login', { error: 'Bạn không có quyền truy cập' });
            }

            if (user.status !== 1) {
                return res.status(403).render('login', { error: 'Tài khoản đã bị vô hiệu hóa' });
            }
            
            // Lưu thông tin người dùng vào session
            req.session.admin = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };
            
            res.redirect('/');
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            res.status(500).render('login', { error: 'Lỗi máy chủ, vui lòng thử lại sau' });
        }
    }   
    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}

module.exports = LoginController;


