const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Log để debug
        console.log('Auth headers:', req.headers.authorization);
        
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy Authorization header'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token'
            });
        }

        // Log token để debug
        console.log('Token received:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log decoded data để debug
        console.log('Decoded token:', decoded);

        // Gán thông tin user vào request
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

module.exports = authMiddleware;
