// src/pages/FestivalListPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FestivalListPage.css';

function FestivalListPage() {
  const [festivals, setFestivals] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFestivals = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/festivals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.status) {
        throw new Error(json.message || '에러 발생');
      }

      setFestivals(json.data);
    } catch (err) {
      console.error('🎯 Festival API Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'PROGRESS':
        return 'status-active';
      case 'BEFORE':
        return 'status-before';
      case 'END':
        return 'status-end';
      case 'REFUND':
        return 'status-refund';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PROGRESS':
        return '진행 중';
      case 'BEFORE':
        return '시작 전';
      case 'END':
        return '종료';
      case 'REFUND':
        return '환불기간';
      default:
        return '';
    }
  };

  return (
    <div className="festival-wrapper">
      <h2 className="festival-title">관리중인 페스티벌 리스트</h2>
      <div className="festival-box">
        {error && <p className="error-message">⚠️ {error}</p>}
        {festivals.map((festival) => (
          <div key={festival.festivalId} className="festival-item">
            <span className={`status-badge ${getStatusClass(festival.status)}`}>
              {getStatusLabel(festival.status)}
            </span>
            <span className="festival-name">
              {festival.title}{' '}
              <span className="invite-code">(초대코드:{festival.inviteCode})</span>
            </span>
            <button
              className="enter-btn"
              onClick={() => navigate(`/admin/festivals/${festival.festivalId}`)}
            >
              [관리자 페이지 입장]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FestivalListPage;
