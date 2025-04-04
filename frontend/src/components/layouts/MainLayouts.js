import React from 'react';
import Header from '../../pages/header';

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
};

export default MainLayout;
