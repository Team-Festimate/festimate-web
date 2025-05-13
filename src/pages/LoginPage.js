// src/pages/LoginPage.js
import React, { useEffect, useState } from 'react';

function LoginPage() {
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    const kakaoKey = process.env.REACT_APP_KAKAO_JS_KEY;
    if (!kakaoKey) {
      console.warn('❗ REACT_APP_KAKAO_JS_KEY가 정의되지 않았습니다.');
      return;
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
      console.log('✅ Kakao SDK 초기화 완료');
    }

    setKakaoReady(true);
  }, []);

  const handleLogin = async () => {
    try {
      const kakao = window.Kakao;
      if (!kakao || !kakao.Auth) {
        alert('카카오 SDK가 올바르게 로드되지 않았습니다.');
        return;
      }

      const result = await new Promise((resolve, reject) => {
        kakao.Auth.login({
          success: (authObj) => resolve(authObj),
          fail: (err) => reject(err),
        });
      });

      const kakaoAccessToken = result.access_token;
      console.log('🎫 카카오 액세스 토큰:', kakaoAccessToken);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: kakaoAccessToken,
        },
      });

      const json = await response.json();
      console.log('🎯 로그인 응답:', json);

      if (!response.ok || !json.status) {
        throw new Error(json.message || '로그인 실패');
      }

      const { userId, accessToken, refreshToken } = json.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (userId) {
        localStorage.setItem('userId', userId);
        alert('로그인 성공! 🎉');
        window.location.href = '/admin/festivals';
      } else {
        alert('회원가입이 필요한 사용자입니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ color: '#F15A5A' }}>FestiMate</h1>
      {kakaoReady ? (
        <button onClick={handleLogin} style={{ backgroundColor: '#FFEB3B', marginTop: 20 }}>
          카카오 계정으로 로그인
        </button>
      ) : (
        <p style={{ color: 'gray' }}>카카오 초기화 중 또는 키 누락</p>
      )}
    </div>
  );
}

export default LoginPage;
