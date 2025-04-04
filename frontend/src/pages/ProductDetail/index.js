import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/components/_ProductDetail.scss';
import '../../styles/components/_buttons.scss';
import { toast } from 'react-hot-toast';
import { cartService } from '../../services/cartService';
import { routers } from '../../utils/routers';
const ProductDetail = () => {
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/product-detail/${id}`);
        console.log('API Response:', response.data);
        setProduct(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response) {
          if (error.response.status === 404) {
            setError('Không tìm thấy sản phẩm');
          } else {
            setError(`Lỗi server: ${error.response.data.message || 'Không xác định'}`);
          }
        } else if (error.request) {
          setError('Không thể kết nối đến server');
        } else {
          setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product.id, 1);
      toast.success('Đã thêm vào giỏ hàng', {
        duration: 2000,
        action: {
          label: 'Xem giỏ hàng',
          onClick: () => navigate(routers.USER.CART)
        }
      });
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-state">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        {product.hinh_anh && (
          <img 
            src={`http://localhost:3001/uploads/${product.hinh_anh}`} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        )}
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="price">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(product.gia)}
        </p>
        <div className="product-info-grid">
          <div className="info-item">
            <span className="label">Nhà sản xuất:</span>
            <span className="value">{product.hang_san_xuat}</span>
          </div>
          <div className="info-item">
            <span className="label">Xuất xứ:</span>
            <span className="value">{product.noi_xuat_xu}</span>
          </div>
          <div className="info-item">
            <span className="label">Tình trạng:</span>
            <span className={`status ${product.so_luong > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.so_luong > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Số lượng còn:</span>
            <span className="value">{product.so_luong}</span>
          </div>
          {product.nam_san_xuat && (
            <div className="info-item">
              <span className="label">Năm sản xuất:</span>
              <span className="value">{product.nam_san_xuat}</span>
            </div>
          )}
        </div>
        <div className="description">
          <h2>Mô tả sản phẩm</h2>
          <p>{product.mota}</p>
        </div>
        <div>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
          <Link to="/cart" className="view-cart-btn">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
