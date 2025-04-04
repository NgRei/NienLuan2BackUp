import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import '../../styles/components/_cart.scss';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.getCart();
            if (response && response.success && Array.isArray(response.cart)) {
                setCartItems(response.cart);
            } else {
                setCartItems([]);
                setError('Không thể tải dữ liệu giỏ hàng');
            }
        } catch (error) {
            console.error('Load cart error:', error);
            setError('Không thể tải giỏ hàng');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartId, quantity) => {
        if (!cartId || quantity < 1) return;
        
        try {
            await cartService.updateQuantity(cartId, quantity);
            loadCart();
        } catch (error) {
            console.error('Update quantity error:', error);
            setError('Lỗi khi cập nhật số lượng');
        }
    };

    const handleRemoveItem = async (cartId) => {
        if (!cartId) return;
        
        try {
            await cartService.removeFromCart(cartId);
            loadCart();
        } catch (error) {
            console.error('Remove item error:', error);
            setError('Lỗi khi xóa sản phẩm');
        }
    };

    const calculateTotal = () => {
        if (!Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => {
            return total + (Number(item.gia) * Number(item.quantity));
        }, 0);
    };

    if (loading) return (
        <div className="cart-container">
            <div className="loading">Đang tải giỏ hàng...</div>
        </div>
    );

    return (
        <div className="cart-container">
            <h2>Giỏ hàng của bạn</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            {(!cartItems || cartItems.length === 0) ? (
                <div className="empty-cart">
                    <p>Giỏ hàng trống</p>
                    <Link to="/" className="continue-shopping">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img 
                                    src={`http://localhost:3001/uploads/${item.hinh_anh}`} 
                                    alt={item.name} 
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="price">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.gia)}
                                    </p>
                                </div>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleUpdateQuantity(
                                            item.id,
                                            Math.max(1, item.quantity - 1)
                                        )}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-total">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(item.gia * item.quantity)}
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <div className="total">
                            <span>Tổng cộng:</span>
                            <span>
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(calculateTotal())}
                            </span>
                        </div>
                        <Link to="/checkout" className="checkout-button">
                            Tiến hành thanh toán
                        </Link>
                        <Link to="/" className="continue-shopping">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
