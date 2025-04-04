import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import '../../styles/components/_CategoryPage.scss';
import { toast } from 'react-hot-toast';
import { cartService } from '../../services/cartService';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                // Fetch thông tin danh mục
                const categoryData = await productService.getCategoryById(id);
                setCategory(categoryData);

                // Fetch sản phẩm của danh mục
                const productsData = await productService.getProductsByCategory(id);
                setProducts(productsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [id]);

    const handleAddToCart = async (productId, event) => {
        try {
            // Ngăn chặn event bubbling
            event.stopPropagation();
            
            // Kiểm tra đăng nhập
            const token = localStorage.getItem('userToken');
            if (!token) {
                toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
                navigate('/login');
                return;
            }

            await cartService.addToCart(productId, 1);
            toast.success('Đã thêm vào giỏ hàng', {
                duration: 2000,
                position: 'top-right',
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    if (loading) {
        return <div className="category-loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="category-error">{error}</div>;
    }

    return (
        <div className="category-page">
            <div className="category-header">
                <h1>
                    {category?.name}
                    {category?.scale && (
                        <span className="category-scale">{category?.scale}</span>
                    )}
                </h1>
                <p className="category-description">{category?.description}</p>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                        <div className="product-card">
                            <div className="product-image">
                                <img 
                                    src={`http://localhost:3001/uploads/${product.hinh_anh}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="price">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.gia)}
                                </p>
                                {product.noi_xuat_xu && (
                                    <p className="origin">
                                        Xuất xứ: {product.noi_xuat_xu}
                                    </p>
                                )}
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={(e) => handleAddToCart(product.id, e)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage; 