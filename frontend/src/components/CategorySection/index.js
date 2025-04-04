import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/components/_CategorySection.scss';

const CategorySection = ({ categoryId, categoryName, categoryDescription }) => {
    const [products, setProducts] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductsByCategory(categoryId);
                // Giới hạn 4 sản phẩm cho mỗi danh mục
                setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
                setError(null);
            } catch (err) {
                console.error(`Error fetching ${categoryName} products:`, err);
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryId, categoryName]);

    const handleAddToCart = async (productId, event) => {
        try {
            // Ngăn chặn sự kiện click lan truyền lên phần tử cha (Link)
            event.preventDefault();
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
        return <div className="category-loading">Đang tải {categoryName}...</div>;
    }

    if (error) {
        return null; // Ẩn section nếu có lỗi
    }

    if (!products || products.length === 0) {
        return null; // Ẩn section nếu không có sản phẩm
    }

    return (
        <section className="category-section">
            <div className="category-header">
                <div className="category-title">
                    <h2>{categoryName}</h2>
                    <span className="category-scale">1/144</span>
                </div>
                <p className="category-description">{categoryDescription}</p>
                <Link to={`/category/${categoryId}`} className="view-all">
                    Xem tất cả
                    <i className="fas fa-chevron-right"></i>
                </Link>
            </div>
            <div className="products-grid category-products">
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                        <div className="product-card">
                            <div className="product-image">
                                <img 
                                    src={`http://localhost:3001/uploads/${product.hinh_anh}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        console.log('Image load error:', product.hinh_anh);
                                        e.target.onerror = null;
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
                                    <p className="origin">Xuất xứ: {product.noi_xuat_xu}</p>
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
        </section>
    );
};

export default CategorySection;
