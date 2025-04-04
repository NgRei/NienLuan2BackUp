import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { routers } from './utils/routers';

import HomePage from './pages/homePage';

import Login from './pages/login';
import Register from './pages/Register';

import Footer from './pages/footer';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

import MainLayout from './components/layouts/MainLayouts';
import ScrollToTop from './components/ScrollToTop';

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
        <ScrollToTop excludePaths={['/cart']} />
        <Toaster position="top-right" />
        <Routes>
          
          {/* Routes không cần layout chính */}
          <Route path={routers.USER.LOGIN} element={<Login />} />
          <Route path={routers.USER.REGISTER} element={<Register />} />
          
          {/* Routes với layout chính */}
          <Route path={routers.USER.HOME} element={<MainLayout> <HomePage /> <Footer /></MainLayout>} />
          <Route path={routers.USER.CATEGORY} element={<MainLayout> <CategoryPage /> <Footer /></MainLayout>} />
          <Route path={routers.USER.PRODUCT_DETAIL} element={<MainLayout> <ProductDetail /> <Footer /></MainLayout>} />
          <Route path={routers.USER.SEARCH} element={<MainLayout> <SearchResults /> <Footer /></MainLayout>} />
          <Route path={routers.USER.PROFILE} element={<MainLayout> <Profile /> <Footer /></MainLayout>} />
          <Route path={routers.USER.CART} element={<MainLayout> <Cart /> <Footer /></MainLayout>} />
          {/* ... other routes that need the main layout */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

