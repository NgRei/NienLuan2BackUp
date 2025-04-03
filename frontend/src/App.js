import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MasterLayout from './pages/MasterLayout';
import HomePage from './pages/homePage';
import Login from './pages/login';
import { routers } from './utils/routers';
import Footer from './pages/footer';
import Header from './pages/header';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div className="App">
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

