const UserModel = require('../models/user.model');
const { ketnoi } = require('../../connect-mySQL');
const bcrypt = require('bcrypt');


class UserController {
    // Hiển thị trang danh sách user
    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; // Số items trên mỗi trang
            const searchTerm = req.query.search || '';
            const role = req.query.role || '';
            
            const result = await UserModel.getAll(page, limit, searchTerm, role);
            
            res.render('user/index', {
                users: result.data,
                searchTerm,
                role,
                pagination: {
                    total: result.total,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    limit
                }
            });
        } catch (error) {
            console.error('Error in index:', error);
            res.status(500).send('Lỗi server');
        }
    }

    // Hiển thị form thêm user
    static showAddForm(req, res) {
        try {  
            res.render('user/add');
        } catch (error) {
            console.error('Error showing add form:', error);
            res.status(500).send('Lỗi server');
        }
    }

    // Xử lý thêm user
    static async add(req, res) {
        try {
            const { username, password, email, full_name, phone, address, role } = req.body;
            
            // Check if username already exists
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).render('user/add', {
                    error: 'Tên đăng nhập đã tồn tại',
                    formData: req.body
                });
            }
            // Check if email already exists
            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.status(400).render('user/add', {
                    error: 'Email đã tồn tại',
                    formData: req.body
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            const user = new UserModel(
                username,
                hashedPassword,
                email,
                full_name,
                phone,
                address,
                role
            );
            user.original_password = password;
            await user.save();
            res.redirect('/user');
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).render('user/add', {
                error: 'Lỗi khi thêm user: ' + error.message,
                formData: req.body
            });
        }
    }

    // Hiển thị form edit user
    static async showEditForm(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('User không tồn tại');
            }
            res.render('user/edit', { user, admin: req.session.admin });
        } catch (error) {
            res.status(500).send('Lỗi server');
        }
    }

    // Xử lý cập nhật user
    static async update(req, res) {
        try {
            const { username, email, full_name, phone, address, role } = req.body;
            await UserModel.update(req.params.id, {
                username,
                email,
                full_name,
                phone,
                address,
                role
            });
            res.redirect('/user');
        } catch (error) {
            res.status(500).send('Lỗi khi cập nhật user');
        }
    }

    // Xử lý xóa user
    static async delete(req, res) {
        try {
            const userId = req.params.id;
            
            // Lấy thông tin user trước khi xóa để kiểm tra
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).send('User không tồn tại');
            }
            
            // Gọi hàm xóa từ model
            const result = await UserModel.delete(userId);
            
            // Kiểm tra xem việc xóa có thành công không
            if (!result || result.affectedRows === 0) {
                throw new Error('Không thể xóa user từ database');
            }
            // Chuyển hướng về trang danh sách user            
            await ketnoi.execute(
                "UPDATE users SET id = id - 1 WHERE id > ?",
                [user.id]   
            );
            await ketnoi.execute("ALTER TABLE users AUTO_INCREMENT = 1");

            res.redirect('/user');
        } catch (error) {
            console.error('Lỗi khi xóa user:', error);
            res.status(500).send(`Lỗi khi xóa user: ${error.message}`);
        }
    }

    // Xử lý đăng nhập
    static async login(req, res) {
        try {
            const username = req.body.login_username;
            const password = req.body.login_password;
            
            console.log('Login attempt:', { username, password }); // Debug login attempt
            
            const user = await UserModel.findByUsername(username);
            console.log('Found user:', user); // Debug user found

            if (!user || user.role !== 'admin') {
                console.log('User validation failed:', { exists: !!user, role: user?.role }); // Debug user validation
                return res.render('login', { 
                    error: 'Tài khoản không có quyền truy cập',
                    admin: null 
                });
            }

            const match = await bcrypt.compare(password, user.password);
            console.log('Password match:', match); // Debug password match
            
            if (!match) {
                return res.render('login', { 
                    error: 'Mật khẩu không đúng',
                    admin: null 
                });
            }

            // Đăng nhập thành công, lưu thông tin vào session
            req.session.admin = user;
            
            // Chuyển hướng đến trang quản lý
            res.redirect('/user');

        } catch (error) {
            console.error('Login error:', error);
            res.render('login', { 
                error: 'Lỗi đăng nhập',
                admin: null 
            });
        }
    }

    // Đăng xuất
    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }

    // Hiển thị form đổi mật khẩu
    static async showChangePasswordForm(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).send('User không tồn tại');
            }
            res.render('user/change-password', { user });
        } catch (error) {
            res.status(500).send('Lỗi server');
        }
    }

    // Xử lý đổi mật khẩu
    static async changePassword(req, res) {
        try {
            const { newPassword, confirmPassword } = req.body;
            
            if (newPassword !== confirmPassword) {
                return res.status(400).send('Mật khẩu xác nhận không khớp');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.updatePassword(req.params.id, hashedPassword, newPassword);
            
            res.redirect('/user');
        } catch (error) {
            res.status(500).send('Lỗi khi cập nhật mật khẩu');
        }
    }
}

module.exports = UserController; 