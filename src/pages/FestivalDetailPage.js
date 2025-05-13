import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FestivalDetailPage.css';

function FestivalDetailPage() {
  const { festivalId } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pointHistory, setPointHistory] = useState([]);
  const [pointInput, setPointInput] = useState('');

  useEffect(() => {
    const fetchFestivalDetail = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/festivals/${festivalId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const json = await res.json();
        if (!res.ok || !json.status) {
          throw new Error(json.message || '데이터를 불러오는 중 오류 발생');
        }

        setFestival(json.data);
      } catch (err) {
        console.error('🎯 Festival Detail API Error:', err);
        setError(err.message);
      }
    };

    fetchFestivalDetail();
  }, [festivalId]);

  const handleSearch = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/festivals/${festivalId}/participants/search?nickname=${encodeURIComponent(searchKeyword)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const json = await res.json();
  
      if (!res.ok || !json.status) {
        throw new Error(json.message || '검색 중 오류 발생');
      }
  
      setUserList(json.data);
      setSelectedUserId(null);
      setPointHistory([]);
      setPointInput('');
    } catch (err) {
      console.error('🎯 Participant Search API Error:', err);
      setError(err.message);
    }
  };  

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    const dummyPointHistory = {
      1: [
        { id: 1, time: '2025.03.05 14:03', type: '차감', point: 1 },
        { id: 2, time: '2025.03.05 14:01', type: '지급', point: 4 },
      ],
      2: [
        { id: 1, time: '2025.03.05 14:03', type: '지급', point: 100 },
        { id: 2, time: '2025.03.05 14:01', type: '지급', point: 4 },
      ],
      3: [
        { id: 1, time: '2025.03.05 14:03', type: '차감', point: 100 },
        { id: 2, time: '2025.03.05 14:01', type: '지급', point: 100 },
      ],
    };
    setPointHistory(dummyPointHistory[userId] || []);
    setPointInput('');
  };

  const handlePointGive = () => {
    const point = parseInt(pointInput, 10);
    if (isNaN(point) || point <= 0) return;

    const newHistory = [
      ...pointHistory,
      {
        id: Date.now(),
        time: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: '지급',
        point,
      },
    ];
    setPointHistory(newHistory);
    setPointInput('');
  };

  const pointTotal = pointHistory.reduce((sum, h) => {
    return h.type === '지급' ? sum + h.point : sum - h.point;
  }, 0);

  if (error) {
    return <p style={{ color: 'red', padding: '1rem' }}>⚠️ {error}</p>;
  }

  if (!festival) {
    return <p style={{ textAlign: 'center' }}>⏳ 페스티벌 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="festival-detail-wrapper">
      <div className="header">
        <span className="status-badge status-school">{festival.status === 'PROGRESS' ? '학교' : '기타'}</span>
        <span className="festival-title">{festival.title}</span>
        <span className="festival-date">{festival.festivalDate}</span>
        <span className="invite-code">(초대코드:{festival.inviteCode})</span>
        <span className="logout" onClick={() => {
          localStorage.clear();
          navigate('/admin/login');
        }}>로그아웃</span>
      </div>

      <div className="search-section">
        <div className="search-box">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button onClick={handleSearch}>회원조회하기</button>
        </div>
      </div>

      <div className="result-section">
        <div className="user-list-box">
          <div className="section-title">검색 결과</div>
          <table>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>이름</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr
                  key={user.id}
                  className="user-row"
                  onClick={() => handleUserClick(user.id)}
                >
                  <td>{user.nickname}</td>
                  <td>{user.name}</td>
                  <td className="bold">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="point-action">
            <input
              type="number"
              value={pointInput}
              onChange={(e) => setPointInput(e.target.value)}
              disabled={!selectedUserId}
            />
            <span>P</span>
            <button
              onClick={handlePointGive}
              disabled={!selectedUserId || !pointInput}
              style={{
                backgroundColor: selectedUserId && pointInput ? '#f15a5a' : '#ccc',
                cursor: selectedUserId && pointInput ? 'pointer' : 'not-allowed',
              }}
            >
              포인트 처리
            </button>
          </div>
        </div>

        <div className="point-history-box">
          <div className="section-title">최신 순</div>
          <table>
            <thead>
              <tr>
                <th>포인트지급시간</th>
                <th>포인트 상세</th>
              </tr>
            </thead>
            <tbody>
              {pointHistory.map((h) => (
                <tr key={h.id}>
                  <td>{h.time}</td>
                  <td>
                    <span className={`point-chip ${h.type === '지급' ? 'plus' : 'minus'}`}>
                      {h.type} {h.point}P
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="point-total">포인트 현황 : <span>{pointTotal}P</span></div>
        </div>
      </div>

      <div className="footer">
        <button className="end-button">페스티벌 종료하기</button>
      </div>
    </div>
  );
}

export default FestivalDetailPage;