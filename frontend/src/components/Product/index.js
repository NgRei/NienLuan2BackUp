import React, { useState, useEffect } from 'react';
import { productService } from '../../services/ProductService';
import '../../styles/components/_product.scss';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log('Fetching products...'); // Debug log
                const data = await productService.getAllProducts();
                console.log('Received products:', data); // Debug log
                setProducts(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="products-loading">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return (
            <div className="products-error">
                <p>Lỗi: {error}</p>
                <div className="debug-info">
                    <p>Response Debug:</p>
                    <pre>
                        {JSON.stringify({
                            error,
                            loading,
                            productsCount: products.length
                        }, null, 2)}
                    </pre>
                </div>
                <button onClick={() => window.location.reload()}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return <div className="no-products">Không có sản phẩm nào</div>;
    }

    return (
        <div className="products-container">
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            {product.hinh_anh && (
                                <img 
                                    src={`http://localhost:3001/uploads/${product.hinh_anh}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        console.log('Image load error:', product.hinh_anh);
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                            )}
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
                ))}
            </div>
        </div>
    );
};

export default Products;
