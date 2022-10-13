import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 개발 모드에서는 App을 1회 미리 실행하여 혹시 모를 문제를 탐지한다.
  // 때문에 개발 모드로 실행 시 모든 코드가 2번씩 실행된다.
  // 프로덕션 모드에서는 1회만 실행된다.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
