import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routers } from '../../utils/routers';
import '../../styles/components/_login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

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
        
        // Kiểm tra form
        if (!formData.username || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            // Test credentials (tạm thời)
            if (formData.username === 'admin' && formData.password === 'admin') {
                // Lưu thông tin đăng nhập
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', formData.username);
                
                // Chuyển về trang chủ
                navigate(routers.USER.HOME);
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng!');
            }

            // Khi có API, sử dụng đoạn code này:
            /*
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate(routers.USER.HOME);
            } else {
                setError(data.message || 'Đăng nhập thất bại!');
            }
            */
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại sau!');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Đăng nhập</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit">Đăng nhập</button>
                    <div className="additional-options">
                        <a href="/forgot-password">Quên mật khẩu?</a>
                        <a href="/register">Đăng ký tài khoản mới</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;   
