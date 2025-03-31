/**
 * Middleware đưa thông tin admin vào locals để sử dụng trong mọi view
 */
const setAdminLocals = (req, res, next) => {
    // Lấy thông tin admin từ session hoặc sessionStorage
    if (req.session && req.session.admin) {
        // Lưu vào res.locals để sử dụng trong tất cả các view
        res.locals.currentAdmin = req.session.admin;
    } else if (req.sessionStorage && req.sessionStorage.getItem('admin')) {
        res.locals.currentAdmin = req.sessionStorage.getItem('admin');
    } else {
        res.locals.currentAdmin = null;
    }
    
    next();
};

module.exports = {
    setAdminLocals
}; 