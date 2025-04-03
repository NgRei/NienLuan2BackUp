import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authServices';
import '../../styles/components/_profile.scss';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const userData = authService.getCurrentUser();
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('Mật khẩu mới không khớp');
                    return;
                }
                if (!formData.currentPassword) {
                    setError('Vui lòng nhập mật khẩu hiện tại');
                    return;
                }
            }

            const response = await authService.updateProfile({
                ...formData,
                id: user.id
            });

            if (response.success) {
                setSuccess('Cập nhật thông tin thành công');
                setUser(response.user);
                setIsEditing(false);
                // Cập nhật thông tin trong localStorage
                authService.updateStoredUserData(response.user);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Thông tin tài khoản</h2>
                {!isEditing && (
                    <button 
                        className="edit-button"
                        onClick={() => setIsEditing(true)}
                    >
                        <i className="fas fa-edit"></i> Chỉnh sửa
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-group">
                    <label>Địa chỉ:</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>

                {isEditing && (
                    <>
                        <div className="password-section">
                            <h3>Đổi mật khẩu</h3>
                            <div className="form-group">
                                <label>Mật khẩu hiện tại:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="submit" className="save-button">
                                <i className="fas fa-save"></i> Lưu thay đổi
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => setIsEditing(false)}
                            >
                                <i className="fas fa-times"></i> Hủy
                            </button>
                        </div>
                    </>
                )}
            </form>

            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Profile;
