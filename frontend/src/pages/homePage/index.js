import React from 'react';
import '../../styles/components/_homePage.scss';

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner">
          <h2>Welcome to ShopMoHinh</h2>
          <p>Khám phá bộ sưu tập mô hình độc đáo</p>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="featured-products">
        <h2 className="section-title">Sản phẩm nổi bật</h2>
        <div className="products-grid">
          {/* Sample Product Cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="product-card">
              <div className="product-image">
                <img src={`/sample-product-${item}.jpg`} alt={`Product ${item}`} />
              </div>
              <div className="product-info">
                <h3>Mô hình #{item}</h3>
                <p className="price">500,000₫</p>
                <button className="add-to-cart">Thêm vào giỏ</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="categories-grid">
          <div className="category-card anime">
            <h3>Mô hình Anime</h3>
          </div>
          <div className="category-card marvel">
            <h3>Mô hình Marvel</h3>
          </div>
          <div className="category-card dc">
            <h3>Mô hình DC</h3>
          </div>
          <div className="category-card game">
            <h3>Mô hình Game</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


