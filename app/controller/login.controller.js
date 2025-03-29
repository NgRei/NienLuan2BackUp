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
            
            // Lưu thông tin người dùng vào express-session
            req.session.admin = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };
            
            // Lưu thông tin vào node-sessionstorage
            req.sessionStorage.setItem('admin', {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            });
            
            res.redirect('/');
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            res.status(500).render('login', { error: 'Lỗi máy chủ, vui lòng thử lại sau' });
        }
    }   
    
    static async logout(req, res) {
        try {
            // Xóa session express
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Lỗi khi xóa session:', err);
                    }
                });
            }
            
            // Xóa dữ liệu từ sessionStorage
            if (req.sessionStorage) {
                req.sessionStorage.removeItem('admin');
            }
            
            // Xóa cookie phiên làm việc
            res.clearCookie('connect.sid');
            
            console.log('Đã đăng xuất thành công');
            res.redirect('/login');
        } catch (error) {
            console.error('Lỗi trong quá trình đăng xuất:', error);
            res.redirect('/login');
        }
    }
}

module.exports = LoginController;


