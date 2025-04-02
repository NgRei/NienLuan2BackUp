const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const { ketnoi, testPool } = require('./connect-mySQL');
const loginRouter = require('./app/router/login.router');
const fs = require('fs');
const sessionStorage = require('node-sessionstorage');
const { setAdminLocals } = require('./app/middlewares/admin.middleware');

// Thêm sessionStorage vào app.locals để sử dụng trong toàn bộ ứng dụng
app.locals.sessionStorage = sessionStorage;
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
    // Thêm cấu hình session trước các middleware khác
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        }
    }));

    // Middleware để sử dụng sessionStorage trong mỗi request
    app.use((req, res, next) => {
        req.sessionStorage = sessionStorage;
        next();
    });
    
    // Middleware để đưa thông tin admin vào locals
    app.use(setAdminLocals);

    // Các middleware cơ bản
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Thêm đường dẫn cho static files
    app.use('/plugins', express.static(path.join(__dirname, 'public/plugins')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/js', express.static(path.join(__dirname, 'public/js')));
    app.use('/dist', express.static(path.join(__dirname, 'public/dist')));
    app.use('/bootstrap', express.static(path.join(__dirname, 'public/bootstrap')));
    
    // Bằng 1 dòng duy nhất tùy theo cách cài đặt của bạn:
    // Nếu cài font-awesome qua npm:
    app.use('/plugins/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome')));

    // HOẶC nếu đã copy thủ công vào thư mục public:
    // app.use('/plugins/font-awesome', express.static(path.join(__dirname, 'public/plugins/font-awesome')));

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

    // Sử dụng debug middleware
    app.use((req, res, next) => {
        console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
        next();
    });

    // Import các router
    const CategoryRoutes = require('./app/router/category/category.router');
    const AddCategoryRoutes = require('./app/router/category/add-category.router');
    const editCategoryRoutes = require('./app/router/category/edit-category.router');
    const ProductRoutes = require('./app/router/product/product.router');
    const AddProductRoutes = require('./app/router/product/add-product.router');
    const EditProductRoutes = require('./app/router/product/edit-product.router');
    const userRoutes = require('./app/router/user.router');
    
    // Import middleware xác thực chỉ dùng cho user
    const checkAdmin = require('./app/middlewares/auth.middleware');

    // Sử dụng route login và trang home không cần xác thực
    app.use('/', loginRouter);

    // Route trang chủ
    app.get('/', (req, res) => {
        if (req.session.admin) {
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    });

    // Áp dụng middleware xác thực cho tất cả các route bên dưới
    app.use(checkAdmin);

    // Các route cần xác thực
    app.get('/home', (req, res) => {
        res.render('home');
    });

    app.use('/danh-muc', CategoryRoutes);
    app.use('/them-danh-muc', AddCategoryRoutes);
    app.use('/danh-muc/chinh-sua', editCategoryRoutes);
    app.use('/san-pham', ProductRoutes);
    app.use('/them-san-pham', AddProductRoutes);
    app.use('/san-pham/chinh-sua', EditProductRoutes);
    app.use('/user', userRoutes);

    // Thêm route debug này (chỉ nên dùng trong môi trường phát triển)
    app.get('/debug-session', (req, res) => {
        res.json({
            expressSession: req.session || 'Không có dữ liệu',
            nodeSessionStorage: {
                admin: req.sessionStorage.getItem('admin') || 'Không có dữ liệu'
            },
            cookies: req.headers.cookie || 'Không có cookie'
        });
    });

    // Middleware xử lý lỗi 404
    app.use((req, res) => {
        // Nếu bạn muốn sử dụng view khác đã tồn tại (ví dụ: error.ejs)
        if (fs.existsSync(path.join(__dirname, 'views', 'error.ejs'))) {
            return res.status(404).render('error', { 
                title: 'Không tìm thấy trang',
                message: 'Trang bạn đang tìm kiếm không tồn tại',
                error: { status: 404 }
            });
        }
        
        // Hoặc trả về phản hồi HTML đơn giản
        res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Trang không tồn tại</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                h1 { color: #d9534f; }
                a { color: #337ab7; text-decoration: none; }
                a:hover { text-decoration: underline; }
              </style>
            </head>
            <body>
              <h1>Lỗi 404 - Trang không tồn tại</h1>
              <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
              <p>Vui lòng kiểm tra lại đường dẫn hoặc <a href="/">quay về trang chủ</a>.</p>
            </body>
            </html>
        `);
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
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to view the app`);
    });
}

// Bắt đầu khởi tạo
init();

module.exports = app;
