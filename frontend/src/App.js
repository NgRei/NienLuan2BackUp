import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MasterLayout from './pages/MasterLayout';
import HomePage from './pages/homePage';
import { routers } from './utils/routers';

function App() {
  return (
    <Router>
      <MasterLayout>
        <Routes>
          <Route path={routers.USER.HOME} element={<HomePage />} />
          {/* Các routes khác */}
        </Routes>
      </MasterLayout>
    </Router>
  );
}

export default App;

