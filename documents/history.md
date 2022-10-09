# 개요
본 실습을 진행하면서 행한 행동들을 대략적으로 기록한 것이다.

# log
## chapter 2
- `Router.js` 내 포함된 로그인 관련 코드를 밖으로 분리. (단일 책임 원칙 준수)
- `jsconfig.json` 파일 추가. (`./src`를 기본 접근 경로로 이용하도록)
- **firebase**의 *app, auth* 모듈을 분리시키기 위해 `fbInstance`라는 폴더를 만들고 `fbApp, fbAuth`로 분리.
- `App.js`에서 `filebase.auth.currentUser`를 받아와 현재 로그인 되어있는지 여부를 판단.
- **Firebase Console > Authociation > Sign-in Method**에서 *이메일, 구글, 깃허브*를 통한 인증 방법 추가.
- `filebase.auth`에서 `CreateUserWithEmailAndPassword`를 통해 계정 등록용 코드 추가.
  - 실행 후 **Filebase console > Authociation >> User**에서 실제 계정이 추가되었음을 확인.
- `signInWithPopup`과 `GoogleAuthProvider, GithubAuthProvider`를 이용하여 구글과 깃허브에 대한 소셜 로그인 기능을 추가
  - 실행 후 **Filebase console > Authociation >> User**에서 실제 계정이 추가되었음을 확인.
  - 불필요하게 생성된 계정들 정리.
- `onAuthStateChanged`를 이용하여 계정 정보의 변경 상태를 추적하고, 이를 통해 로그인 여부를 확인받음.
  - 로그인 여부에 따라 화면을 달리 표시하도록 수정.
- Router에 적용할 코드들을 직접 작성하는 대신 `path`와 `element` 부분만을 작성한 객체로 분리하여 `{Object.values(target).map((e) => <Route ... />)}`으로 자동할당 되도록 설정
  - 로그인 여부에 따른 routing을 제거하고 대신 로그인 여부 정보를 하위 element에 props로 넘기도록 코드 수정. 하위 코드에서 조건에 따른 리다이렉팅을 수행하도록 코드 개선 시도.
- `useNavigate`를 사용하여 로그인이 되어있지 않은 상태에서 `/home`이나 `/profile`에 접근 시 자동으로 `/auth`로 옮겨지도록 설정
  - 의도한대로 동작하는 것은 확인되었으나 전환 시점에 warning이 발생. `Cannot update a component ("HashRouter")...`
  - `navigate` 코드를 `useEffect` 내부로 이동. -> 위 경고가 사라짐.