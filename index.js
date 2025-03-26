const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const { ketnoi, testPool } = require('./connect-mySQL');

// Kiểm tra kết nối database khi khởi động
async function init() {
    try {
        // Kiểm tra kết nối pool
        const poolOk = await testPool();
        if (!poolOk) {
            console.error('Không thể kết nối pool database. Dừng ứng dụng.');
            process.exit(1);
        }

        // Kiểm tra kết nối trực tiếp
        const [result] = await ketnoi.query('SELECT 1 + 1 as sum');
        console.log('✅ Kết nối database thành công:', result[0].sum);
        
        // Chỉ kiểm tra bảng nếu kết nối thành công
        await checkTables();
        
        // Khởi động server sau khi kiểm tra kết nối thành công
        startServer();
    } catch (error) {
        console.error('❌ Lỗi khởi tạo:', error);
        process.exit(1);
    }
}

// Kiểm tra bảng
async function checkTables() {
    try {
        // Kiểm tra bảng category
        const [categoryResult] = await ketnoi.query(`
            SELECT COUNT(*) as count FROM information_schema.tables 
            WHERE table_schema = 'ql_shopmohinh' AND table_name = 'category'
        `);
        
        if (categoryResult[0].count === 0) {
            console.error('❌ Bảng category không tồn tại trong database!');
        } else {
            // Kiểm tra dữ liệu
            const [categoryCount] = await ketnoi.query('SELECT COUNT(*) as count FROM category');
            console.log(`✅ Bảng category tồn tại với ${categoryCount[0].count} bản ghi`);
        }
        
        // Kiểm tra bảng product
        const [productResult] = await ketnoi.query(`
            SELECT COUNT(*) as count FROM information_schema.tables 
            WHERE table_schema = 'ql_shopmohinh' AND table_name = 'product'
        `);
        
        if (productResult[0].count === 0) {
            console.error('❌ Bảng product không tồn tại trong database!');
        } else {
            const [productCount] = await ketnoi.query('SELECT COUNT(*) as count FROM product');
            console.log(`✅ Bảng product tồn tại với ${productCount[0].count} bản ghi`);
        }
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra bảng:', error);
        throw error; // Tiếp tục throw để hàm init bắt được
    }
}

// Cấu hình middleware và routes
function configureApp() {
    // Các middleware cơ bản
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Middleware database ping - kiểm tra kết nối trước mỗi request
    app.use(async (req, res, next) => {
        try {
            await ketnoi.query('SELECT 1');
            next();
        } catch (error) {
            console.error('Database connection lost:', error);
            
            // Thử kết nối lại
            try {
                await testPool();
                next(); // Nếu kết nối lại thành công, tiếp tục
            } catch (reconnectError) {
                res.status(500).render('error', {
                    message: 'Lỗi kết nối database',
                    error: {status: 500}
                });
            }
        }
    });

    // CẤU HÌNH UPLOAD FILE
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
        }
    };

    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });

    // Export middleware upload
    app.locals.upload = upload;
    module.exports.upload = upload;

    // Import routes
    const categoryRoutes = require('./app/router/category/category.router');
    const addCategoryRoutes = require('./app/router/category/add-category.router');
    const editCategoryRoutes = require('./app/router/category/edit-category.router');
    const productRoutes = require('./app/router/product/product.router');
    const addProductRoutes = require('./app/router/product/add-product.router');
    const editProductRoutes = require('./app/router/product/edit-product.router');

    // Routes
    app.get('/', function (req, res) {
        res.render('home');
    });

    // Sử dụng routes - đặt debug middleware trước mỗi route
    app.use('/', (req, res, next) => {
        console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
        next();
    }, categoryRoutes);
    app.use('/', addCategoryRoutes);
    app.use('/', editCategoryRoutes);
    app.use('/', productRoutes);
    app.use('/', addProductRoutes);
    app.use('/', editProductRoutes);

    // Middleware xử lý lỗi 404
    app.use((req, res, next) => {
        console.log('404 Not Found: ', req.originalUrl);
        res.status(404).render('error', {
            message: 'Trang không tồn tại',
            error: {status: 404}
        });
    });

    // Middleware xử lý lỗi
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(err.status || 500).render('error', {
            message: err.message || 'Đã xảy ra lỗi',
            error: err
        });
    });
}

// Khởi động server
function startServer() {
    configureApp();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to view the app`);
    });
}

// Bắt đầu khởi tạo
init();
