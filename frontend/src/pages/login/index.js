import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authServices';
import { toast } from 'react-hot-toast';
import '../../styles/components/_login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            setLoading(true);
            const response = await authService.login(formData);
            
            if (response.success) {
                localStorage.setItem('userToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                // Kiểm tra và xử lý redirect
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin'); // Xóa path đã lưu
                    navigate(redirectPath); // Chuyển về trang sản phẩm
                    toast.success('Đăng nhập thành công! Bạn có thể tiếp tục thêm vào giỏ hàng.');
                } else {
                    navigate('/'); // Nếu không có redirect path thì về trang chủ
                    toast.success('Đăng nhập thành công!');
                }
            } else {
                setError(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                // Lỗi từ server
                setError(error.response.data.message || 'Đăng nhập thất bại');
            } else if (error.request) {
                // Lỗi không thể kết nối đến server
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                // Lỗi khác
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-brand">
                    <Link to="/" className="brand-link">
                        <h1>ShopMoHinh</h1>
                    </Link>
                </div>
                
                <div className="login-form">
                    <h2>Đăng nhập</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên đăng nhập hoặc :</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập hoặc email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="additional-links">
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                        <Link to="/register">Đăng ký tài khoản mới</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;   
