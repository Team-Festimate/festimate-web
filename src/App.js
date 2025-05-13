// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FestivalListPage from './pages/FestivalListPage';
import FestivalDetailPage from './pages/FestivalDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/festivals" element={<FestivalListPage />} />
        <Route path="/admin/festivals/:festivalId" element={<FestivalDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
