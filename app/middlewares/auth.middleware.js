function checkAdmin(req, res, next) {
    console.log('[AUTH] Checking admin login for', req.originalUrl);
    
    // Kiểm tra xem user đã đăng nhập chưa
    if (!req.session.admin) {
        console.log('[AUTH] Not logged in, redirecting to login');
        return res.redirect('/login');
    }
    
    // Kiểm tra xem role có phải admin không
    if (req.session.admin.role !== 'admin') {
        console.log('[AUTH] Not admin role, redirecting to login');
        return res.redirect('/login');
    }
    
    console.log('[AUTH] Authentication successful');
    // Nếu đã đăng nhập và có quyền admin, cho phép tiếp tục
    next();
}

module.exports = checkAdmin; 