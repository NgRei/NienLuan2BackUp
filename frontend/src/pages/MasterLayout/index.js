import React from 'react';
import Header from '../header/index';
import Footer from '../footer/index';
import HomePage from '../homePage/index';
 const MasterLayout = ({children, ...props}) => {
  return (
    <div className="master-layout" {...props}>
        <Header />  
        <main className="main-content"> 
            <HomePage />
        </main>
        <Footer />
    </div>
  );
};  

export default MasterLayout;


