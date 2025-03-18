const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Import routes
const categoryRoutes = require('./app/router/category.router');
const addCategoryRoutes = require('./app/router/add-category.router');

// Routes
app.get('/', function (req, res) {
    res.render('home');
});

// Sử dụng routes
app.use('/', categoryRoutes);
app.use('/', addCategoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the app`);
});
