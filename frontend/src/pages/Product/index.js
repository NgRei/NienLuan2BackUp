import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import '../../styles/components/_product.scss';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getFeaturedProducts();
                setProducts(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching featured products:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm nổi bật');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return <div className="products-loading">Đang tải sản phẩm nổi bật...</div>;
    }

    if (error) {
        return (
            <div className="products-error">
                <p>{error}</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return <div className="no-products">Không có sản phẩm nổi bật</div>;
    }

    return (
        <div className="products-container">
            <div className="products-grid featured-products">
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                        <div className="product-card">
                            <div className="product-image">
                                {product.hinh_anh && (
                                    <img 
                                        src={`http://localhost:3001/uploads/${product.hinh_anh}`}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                )}
                                <div className="featured-badge">Nổi bật</div>
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
                                <button className="add-to-cart-btn">
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

export default FeaturedProducts;
