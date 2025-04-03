import React from 'react';
import '../../styles/components/_footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
            </li>
            <li>
              <i className="fas fa-phone-alt"></i>
              <span>Hotline: 0866.123.456</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>Email: contact@shopmohinh.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày)</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Thông tin doanh nghiệp</h3>
          <ul>
            <li>
              <i className="fas fa-building"></i>
              <span>Công ty TNHH Shop Mô Hình</span>
            </li>
            <li>
              <i className="fas fa-id-card"></i>
              <span>Mã số doanh nghiệp: 0123456789</span>
            </li>
            <li>
              <i className="fas fa-calendar-alt"></i>
              <span>Ngày cấp: 01/01/2023</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Trụ sở chính</h3>
          <ul>
            <li>
              <i className="fas fa-home"></i>
              <span>Văn phòng: Tầng 15, Tòa nhà Center Building</span>
            </li>
            <li>
              <i className="fas fa-map"></i>
              <span>Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
            </li>
            <li>
              <i className="fas fa-phone-square"></i>
              <span>Tel: (028) 1234 5678</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Shop Mô Hình.</p>
        <p>Chuyên bán mô hình Gundam, sản phẩm chính hãng.</p>

      </div>
    </footer>
  );
};

export default Footer;


