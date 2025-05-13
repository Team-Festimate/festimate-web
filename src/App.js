import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FestivalListPage from './pages/FestivalListPage';
import FestivalDetailPage from './pages/FestivalDetailPage';

function App() {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/festivals" element={<FestivalListPage />} />
        <Route path="/festivals/:festivalId" element={<FestivalDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
