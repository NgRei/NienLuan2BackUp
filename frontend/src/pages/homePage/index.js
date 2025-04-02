import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/api';
import '../../styles/components/_homePage.scss';
import Products from '../../components/Product/index';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
    setCurrentSlide((prev) => prev === categories.length - 1 ? 0 : prev + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev === 0 ? categories.length - 1 : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="homepage-container">
      <section className="banner-section">
        <div className="banner">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="banner-content">
                <img src={category.image} alt={category.name} />
                <div className="banner-info">
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <Link to={`/category/${category.id}`} className="explore-btn">
                    Khám phá ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="banner-nav prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="banner-nav next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Dots Navigation */}
          <div className="banner-dots">
            {categories.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="products-section">
        <div className="section-title">
          <h2>Sản phẩm nổi bật</h2>
        </div>
        <Products />
      </section>
    </div>
  );
};

export default HomePage;


