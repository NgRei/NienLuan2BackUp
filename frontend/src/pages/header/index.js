import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/_header.scss'; 


const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    console.log('Searching for:', searchTerm);
  };

  const categories = [
    "Mô hình Anime",
    "Mô hình Marvel",
    "Mô hình DC",
    "Mô hình Game",
    "Phụ kiện"
  ];

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
          <li>
            <Link to="/login" className="icon-link">
              <i className="fas fa-user"></i>
              <span className="icon-text">Đăng nhập</span>
            </Link>
          </li>
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
          <div 
            className="category-dropdown"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <span className="dropdown-title">
              <i className="fas fa-bars"></i> Danh mục
            </span>
            {showCategories && (
              <ul className="dropdown-menu">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`/category/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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


