import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import '../../styles/components/_SearchResults.scss';
import { toast } from 'react-hot-toast';
import { cartService } from '../../services/cartService';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('q');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const data = await productService.searchProducts(searchTerm);
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setError('Có lỗi xảy ra khi tìm kiếm');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
    }, [searchTerm]);
    const handleAddToCart = async (productId) => {
        try {
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
        return <div className="search-loading">Đang tìm kiếm...</div>;
    }

    if (error) {
        return <div className="search-error">{error}</div>;
    }

    return (
        <div className="search-results-container">
            <h2>Kết quả tìm kiếm cho "{searchTerm}"</h2>
            {products.length === 0 ? (
                <div className="no-results">
                    <p>Không tìm thấy sản phẩm nào phù hợp</p>
                </div>
            ) : (
                <>
                    <p className="results-count">Tìm thấy {products.length} sản phẩm</p>
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
                                            onClick={(e) => {
                                                e.preventDefault(); // Ngăn chặn chuyển hướng đến trang chi tiết
                                                handleAddToCart(product.id);
                                            }}
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchResults; 