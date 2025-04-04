import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Thêm import này
import MasterLayout from './pages/MasterLayout';
import HomePage from './pages/homePage';
import Login from './pages/login';
import { routers } from './utils/routers';
import Footer from './pages/footer';
import Header from './pages/header';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            // Styling
            duration: 2000,
            style: {
              background: '#333',
              color: '#fff',
            },
            // Cấu hình success
            success: {
              duration: 3000,
              style: {
                background: '#4caf50',
              },
            },
            // Cấu hình error
            error: {
              duration: 3000,
              style: {
                background: '#f44336',
              },
            },
          }}
        />
        <Header />
        <Routes>
          <Route path={routers.USER.LOGIN} element={<Login />} />
          <Route path="*" element={
            <MasterLayout>
              <Routes>
                <Route path={routers.USER.HOME} element={<HomePage />} />
                <Route path={routers.USER.CATEGORY} element={<CategoryPage />} />
                <Route path={routers.USER.FOOTER} element={<Footer />} />
                <Route path={routers.USER.HEADER} element={<Header />} />
                <Route path={routers.USER.PRODUCT_DETAIL} element={<ProductDetail />} />
                <Route path={routers.USER.SEARCH} element={<SearchResults />} />
                <Route path={routers.USER.PROFILE} element={<Profile />} />
                <Route path={routers.USER.CART} element={<Cart />} />
                {/* Các routes khác */}
              </Routes>
            </MasterLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

