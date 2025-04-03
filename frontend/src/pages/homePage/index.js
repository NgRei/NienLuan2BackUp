import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/api';
import '../../styles/components/_homePage.scss';
import FeaturedProducts from '../../pages/Product/index';
import CategorySection from '../../components/CategorySection';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching categories...'); 
        const data = await categoryService.getAllCategories();
        console.log('Fetched categories:', data);
        
        if (!data || data.length === 0) {
          throw new Error('Không có dữ liệu danh mục');
        }
        
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('Categories state:', categories);
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0) {
      console.log('Current category:', categories[currentSlide]);
      console.log('Current category ID:', categories[currentSlide].id);
    }
  }, [currentSlide, categories]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && categories.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === categories.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, categories.length]);

  const nextSlide = () => {
    if (categories.length > 0) {
      setCurrentSlide((prev) => prev === categories.length - 1 ? 0 : prev + 1);
    }
  };

  const prevSlide = () => {
    if (categories.length > 0) {
      setCurrentSlide((prev) => prev === 0 ? categories.length - 1 : prev - 1);
    }
  };

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="homepage-container">
      {categories.length > 0 && (
        <section className="banner-section">
          <div className="banner">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="banner-content">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={(e) => {
                      console.log('Image load error:', e);
                      e.target.onerror = null;
                      e.target.src = '/images/default.png';
                    }}
                  />
                  <div className="banner-info">
                    <h2>{category.name}</h2>
                    <p>{category.description || 'Khám phá các sản phẩm trong danh mục này'}</p>
                    <Link to={`/category/${category.id}`} className="explore-btn">
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <button 
              className="banner-nav prev" 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="banner-nav next" 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <div className="banner-dots">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      <section className="products-section">
        <div className="section-title">
          <h2>Sản phẩm nổi bật</h2>
        </div>
        <FeaturedProducts />
      </section>

      <CategorySection 
        categoryId={7}
        categoryName="Hi-Resolution Model (HiRM)"
      />

      <CategorySection 
        categoryId={13}
        categoryName="PERFECT GRADE - PG"
      />

      <CategorySection 
        categoryId={10}
        categoryName="REAL GRADE - RG"
      />
    </div>
  );
};

export default HomePage;


