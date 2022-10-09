// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// 각 정보를 환경 변수의 형태로 분리한 이유는 github의 공개된 저장소에 보안상 민감한 정보가 수록되는 것을 방지하기 위함이다.
// 단, 이렇게 해도 최종 빌드된 데이터에 포함되므로 완전히 숨겨지는 것은 아니다.
const firebaseConfig = { 
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
export default initializeApp(firebaseConfig);