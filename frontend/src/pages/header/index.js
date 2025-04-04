import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/_header.scss'; 
import { routers } from '../../utils/routers';
import { categoryService } from '../../services/api';
import { authService } from '../../services/authServices';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Nếu cuộn xuống và đã cuộn quá 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } 
      // Nếu cuộn lên
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAuthenticated(!!user);
    setUserData(user);
  }, []);

  // Thêm useEffect để xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    // Xử lý mouseout
    const handleMouseLeave = (event) => {
      // Kiểm tra xem chuột có thực sự rời khỏi toàn bộ dropdown không
      const relatedTarget = event.relatedTarget;
      if (dropdownRef.current && !dropdownRef.current.contains(relatedTarget)) {
        // Thêm một chút delay để tránh đóng quá nhanh
        setTimeout(() => {
          setShowCategories(false);
        }, 500);
      }
    };

    // Thêm event listeners
    document.addEventListener('mousedown', handleClickOutside);
    dropdownRef.current?.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      dropdownRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        // Chuyển hướng đến trang kết quả tìm kiếm với query parameter
        window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };


  return (
    <header className={`container ${isVisible ? 'header-visible' : 'header-hidden'}`}>
      <nav className="main-nav">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>ShopMoHinh</h1>
          </Link>
        </div>

        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li>
                <span className="user-name">Xin chào, {userData?.fullName}</span>
              </li>
              <li>
                <Link to="/profile" className="icon-link">
                  <i className="fas fa-user"></i>
                  <span className="icon-text">Tài khoản</span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="icon-link">
                <i className="fas fa-user"></i>
                <span className="icon-text">Đăng nhập</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/cart" className="icon-link">
              <i className="fas fa-shopping-cart"></i>
              <span className="icon-text">Giỏ hàng</span>
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="sub-nav">
        <div className="left-menu">
          <div className="category-dropdown" ref={dropdownRef}>
            <button 
              className="dropdown-title"
              onClick={toggleCategories}
            >
              <i className="fas fa-bars"></i> Danh mục
            </button>
            <div className={`dropdown-menu ${showCategories ? 'show' : ''}`}>
              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : (
                <ul>
                  {Array.isArray(categories) && categories.map((category) => (
                    <li key={category.id}>
                      <Link 
                        to={`/category/${category.id}`}
                        onClick={() => setShowCategories(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="info-links">
            <Link to="/about">Giới thiệu</Link>
            <Link to="/policy">Chính sách</Link>
            <Link to="/warranty">Bảo hành</Link>
          </div>
        </div>

        <div className="contact-info">
          <i className="fas fa-phone-alt"></i>
          <span>Hotline: 0866123456</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;


