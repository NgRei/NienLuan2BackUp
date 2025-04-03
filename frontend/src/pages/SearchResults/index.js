import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import '../../styles/components/_SearchResults.scss';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('q');

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