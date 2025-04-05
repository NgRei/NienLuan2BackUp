import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/_checkout.scss';

const Checkout = () => {
    const navigate = useNavigate();
    const { token, isAuthenticated, checkAuth } = useAuth();
    
    const [formData, setFormData] = useState({
        shipping_address: '',
        payment_method: 'cash',
        notes: ''
    });
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!checkAuth()) {
            navigate('/login');
            return;
        }
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            console.log('Fetching cart data...');
            
            const response = await fetch('http://localhost:3001/api/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch cart: ${response.status}`);
            }

            const data = await response.json();
            console.log('Cart data:', data);

            if (data.success && data.cart && data.cart.length > 0) {
                setCartItems(data.cart);
                const total = data.cart.reduce((sum, item) => 
                    sum + (item.gia * item.quantity), 0
                );
                setTotalAmount(total);
            } else {
                setCartItems([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Không thể tải dữ liệu giỏ hàng');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartData();
        }
        
        // Đọc dữ liệu từ localStorage để đảm bảo có UI
        const tempCartData = localStorage.getItem('tempCartData');
        if (tempCartData) {
            try {
                const parsedData = JSON.parse(tempCartData);
                setCartItems(parsedData.items);
                setTotalAmount(parsedData.total);
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
            }
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/checkout/process', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Xóa localStorage
                localStorage.removeItem('tempCartData');
                
                // Hiển thị popup thành công
                const popup = document.createElement('div');
                popup.className = 'success-popup';
                popup.innerHTML = `
                    <div class="success-popup-content">
                        <i class="fa fa-check-circle"></i>
                        <h2>Đặt hàng thành công!</h2>
                        <p>Cảm ơn bạn đã đặt hàng. Đơn hàng #${data.orderId} của bạn đã được tiếp nhận.</p>
                    </div>
                `;
                document.body.appendChild(popup);
                
                // Style cho popup
                const style = document.createElement('style');
                style.innerHTML = `
                    .success-popup {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                    }
                    .success-popup-content {
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                        text-align: center;
                        max-width: 400px;
                    }
                    .success-popup i {
                        color: #4caf50;
                        font-size: 60px;
                        margin-bottom: 20px;
                    }
                    .success-popup h2 {
                        margin-bottom: 10px;
                        color: #333;
                    }
                    .success-popup p {
                        color: #666;
                    }
                `;
                document.head.appendChild(style);
                
                // Chuyển về trang giỏ hàng sau 4 giây
                setTimeout(() => {
                    document.body.removeChild(popup);
                    document.head.removeChild(style);
                    navigate('/cart');
                }, 4000);
            } else {
                throw new Error(data.message || 'Đặt hàng thất bại');
            }
        } catch (error) {
            setError(error.message);
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/checkout');
        return <Navigate to="/login" />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout">
                <h1 className="checkout__title">Giỏ hàng trống</h1>
                <button 
                    className="checkout__button"
                    onClick={() => navigate('/')}
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    return (
        <div className="checkout">
            <h1 className="checkout__title">Thanh toán</h1>
            
            {error && (
                <div className="checkout__error">
                    {error}
                </div>
            )}
            
            {cartItems && cartItems.length > 0 ? (
                <div className="checkout__summary">
                    <h2 className="checkout__summary-title">Đơn hàng của bạn</h2>
                    {cartItems.map(item => (
                        <div key={item.id} className="checkout__item">
                            <span className="checkout__item-name">{item.name}</span>
                            <span className="checkout__item-quantity">x{item.quantity}</span>
                            <span className="checkout__item-price">{item.gia.toLocaleString('vi-VN')}₫</span>
                        </div>
                    ))}
                    <div className="checkout__total">
                        <strong>Tổng cộng: {totalAmount.toLocaleString('vi-VN')}₫</strong>
                    </div>
                </div>
            ) : (
                <div className="checkout__empty">
                    <h2>Giỏ hàng trống</h2>
                    <button 
                        className="checkout__button"
                        onClick={() => navigate('/')}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <button 
                    type="button"
                    onClick={fetchCartData}
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginRight: "10px"
                    }}
                >
                    Thử lại kết nối
                </button>
                
                <button 
                    type="button"
                    onClick={() => {
                        // Log thông tin để debug
                        console.log('Auth state:', { token, isAuthenticated });
                        console.log('Cart state:', { cartItems, totalAmount });
                    }}
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "4px"
                    }}
                >
                    Kiểm tra thông tin
                </button>
            </div>

            <form onSubmit={handleSubmit} className="checkout__form">
                <div className="checkout__form-group">
                    <label>Địa chỉ giao hàng:</label>
                    <textarea
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập địa chỉ giao hàng của bạn"
                    />
                </div>

                <div className="checkout__form-group">
                    <label>Phương thức thanh toán:</label>
                    <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                    >
                        <option value="cash">Tiền mặt</option>
                        <option value="credit_card">Thẻ tín dụng</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                        <option value="zalopay">ZaloPay</option>
                        <option value="momo">Momo</option>
                    </select>
                </div>

                <div className="checkout__form-group">
                    <label>Ghi chú:</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                    />
                </div>

                <button 
                    type="submit" 
                    className="checkout__button"
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;