import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MasterLayout from './pages/MasterLayout';
import HomePage from './pages/homePage';
import Login from './pages/login';
import { routers } from './utils/routers';
import Footer from './pages/footer';
import Header from './pages/header';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routers.USER.LOGIN} element={<Login />} />
        <Route path="*" element={
          <MasterLayout>
            <Routes>
              <Route path={routers.USER.HOME} element={<HomePage />} />
              <Route path={routers.USER.FOOTER} element={<Footer />} />
              <Route path={routers.USER.HEADER} element={<Header />} />
              {/* Các routes khác */}
            </Routes>
          </MasterLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;

