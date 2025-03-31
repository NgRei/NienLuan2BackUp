/**
 * Middleware kiểm tra quyền admin
 */
const checkAdmin = (req, res, next) => {
    // Kiểm tra cả session express và sessionStorage
    if (!req.session.admin && !req.sessionStorage.getItem('admin')) {
        console.log('[AUTH] Từ chối truy cập: Không có phiên đăng nhập');
        return res.redirect('/login');
    }
    
    // Kiểm tra xem session đã hết hạn chưa (nếu cần)
    const admin = req.sessionStorage.getItem('admin');
    if (admin && admin.loginTime) {
        const loginTime = new Date(admin.loginTime);
        const currentTime = new Date();
        const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
        
        // Nếu đã đăng nhập quá 24 giờ, yêu cầu đăng nhập lại
        if (hoursSinceLogin > 24) {
            console.log('[AUTH] Phiên đăng nhập đã hết hạn');
            req.session.destroy();
            req.sessionStorage.removeItem('admin');
            return res.redirect('/login');
        }
    }
    

    // Nếu mọi thứ đều ổn, cho phép tiếp tục
    console.log('[AUTH] Xác thực thành công cho:', req.session.admin?.username || admin?.username);
    next();
};

module.exports = checkAdmin;