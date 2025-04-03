const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Tài khoản không tồn tại'
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Mật khẩu không chính xác'
                });
            }

            // Tạo token với đầy đủ thông tin cần thiết
            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Log token được tạo để debug
            console.log('Generated token:', token);

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi đăng nhập'
            });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const {
                fullName,
                email,
                phone,
                address,
                currentPassword,
                newPassword
            } = req.body;

            // Kiểm tra user tồn tại
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            // Nếu có thay đổi mật khẩu
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Vui lòng nhập mật khẩu hiện tại'
                    });
                }

                const isValidPassword = await bcrypt.compare(
                    currentPassword,
                    user.password
                );

                if (!isValidPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mật khẩu hiện tại không đúng'
                    });
                }

                // Hash mật khẩu mới
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                // Cập nhật cả password và original_password
                await UserModel.updatePassword(userId, hashedPassword, newPassword);
            }

            // Cập nhật thông tin khác
            await UserModel.updateProfile(userId, {
                full_name: fullName,
                email,
                phone,
                address
            });

            // Lấy thông tin user đã cập nhật
            const updatedUser = await UserModel.findById(userId);

            // Trả về thông tin đã cập nhật
            res.json({
                success: true,
                message: 'Cập nhật thông tin thành công',
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    fullName: updatedUser.full_name,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    role: updatedUser.role,
                    created_at: updatedUser.created_at
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật thông tin: ' + error.message
            });
        }
    }
}

module.exports = AuthController;
