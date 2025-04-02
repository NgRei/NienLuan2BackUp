import React from 'react';
import Header from '../header';
import Footer from '../footer';
import { useLocation } from 'react-router-dom';
import { routers } from '../../utils/routers';

const MasterLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === routers.USER.LOGIN;

  return (
    <div className="app-container">
      {!isLoginPage && <Header />}
      <main className="main-content">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default MasterLayout;


