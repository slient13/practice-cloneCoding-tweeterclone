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
  - 실행 후 **Filebase console > Authociation > User**에서 실제 계정이 추가되었음을 확인.
  - 불필요하게 생성된 계정들 정리.
- `onAuthStateChanged`를 이용하여 계정 정보의 변경 상태를 추적하고, 이를 통해 로그인 여부를 확인받음.
  - 로그인 여부에 따라 화면을 달리 표시하도록 수정.
- Router에 적용할 코드들을 직접 작성하는 대신 `path`와 `element` 부분만을 작성한 객체로 분리하여 `{Object.values(target).map((e) => <Route ... />)}`으로 자동할당 되도록 설정
  - 로그인 여부에 따른 routing을 제거하고 대신 로그인 여부 정보를 하위 element에 props로 넘기도록 코드 수정. 하위 코드에서 조건에 따른 리다이렉팅을 수행하도록 코드 개선 시도.
- `useNavigate`를 사용하여 로그인이 되어있지 않은 상태에서 `/home`이나 `/profile`에 접근 시 자동으로 `/auth`로 옮겨지도록 설정
  - 의도한대로 동작하는 것은 확인되었으나 전환 시점에 warning이 발생. `Cannot update a component ("HashRouter")...`
  - `navigate` 코드를 `useEffect` 내부로 이동. -> 위 경고가 사라짐.

## chapter 3
- **Firebase Console > Firestore Database**에서 데이터베이스 생성.
- `getFirestore(FirebaseApp)`을 통해 **Firestore**용 객체를 추출하고 이를 반환하는 파일 제작.
- `firebase/firestore`의 `addDoc($collection, $data)`, `collection($firestoreDB, $name)`을 이용하여 데이터를 추가하는 코드 작성.
  - **Firebase Console > Firestore Database > Data**에서 데이터가 추가됨을 확인.
- `firebase/firestore`의 `getDoc($collection)`을 이용하여 데이터를 불러옴.
  - 불러온 데이터는 `querySnapshot`이라는 변수에 담았으며, `Doc` 이라고 하는 데이터들의 배열임을 확인.
    `Doc`은 `Doc.id`와 `Doc.data()`를 가지고 있는데, `id`는 고유한 아이디 정보를, `data()`는 보유한 정보를 json 형태로 반환해줌.
  - 위 내용들을 이용하여 데이터를 받았고, 그것을 화면 아래에 추가되도록 설정.
    - `useEffect`를 이용하여 실시간 반영되도록 함.
- (오류) 갑자기 database 기능이 마비되는 현상 발견
  - 문제 원인을 찾기 위해 오류 메시지를 보고 **Firebase Console > Firestore Database**에 들어가서 확인 -> 일일 할당량이 초과되었다는 안내가 나옴.
  - 할당량 페이지를 보니 **데이터베이스 읽기**에 할당되어있던 총 5만건의 요청 한도가 소진됨을 확인.
  - 코드를 둘러보니 `useEffect()`에 질의 코드가 포함되어 있었음. 이로 인해 불필요하게 잦은 데이터 요청이 발생했던 것.
    - 이 상태에서 중간에 코드를 잘못 작성해 계속 상태가 갱신된 적이 있었는데, 이 때 무의미한 요청이 대량 발생해서 5만건을 채운 것으로 파악됨.
  - (해결) 굳이 같이 렌더링 될 필요 없는 목록 출력부를 별도의 코드로 분리해서 렌더링 영향 범위를 최소화. (`NweetForm`이랑 `Contents`로 구분)
    - (기타) firebase에는 아까전의 상황 처럼 개발 도중에 발생한 문제로 불필요한 비용 지출이 발생하거나 실제 서비스 데이터가 손상되는 등의 일을 방지하기 위해 로컬 환경에서도 프로토타입을 만들어볼 수 있는 도구를 제공하는 듯 하다. **로컬 애뮬레이터 도구 모음**이라고 한다. 추후 같은 실수를 반복하지 않기 위해 이를 적용하는 것을 먼저 시도해보면 좋을 듯 하다.
- **firebase CLI**를 이용해 **firebase emulator** 세팅.
  - `fbDB` 파일을 수정하여 로컬 호스트로 진입한 경우 로컬 에뮬레이터의 데이터베이스로 진입하도록 수정.
  - `firebase emulators:start` 명령을 통해 로컬 에뮬레이터 실행
    - 직후 생성 및 조회 기능이 로컬 애뮬레이터의 데이터베이스로 이루어지고 실 서비스 할당량은 소모하지 않음을 확인.
- 로그를 조사한 결과 지나치게 많은 조회 요청이 이루어지고 있음을 확인.
  - `onSnapshot` 함수를 이용하여 데이터베이스에 변화가 생기는 경우에 대한 이벤트 리스너를 연결.
    - 이벤트 발생과 무관하게 엄청난 수의 조회가 발생함을 확인.
  - `onSnapshot` 관련 코드를 `useEffect(..., [])`에 옮겨넣음.
    - 기대한 대로 동작됨을 확인. 다만, 조회할 때마다 2회식 로그가 찍히는 것이 확인됨. 이는 추후 수정 예정.
  - 데이터 추가 시 즉시 반영되긴 하나, 순서가 이상함.
    - (원인)검색 결과 임의로 지정된 문서 ID 순서로 가져오기 때문. 
    - (해결) `query($collectRef, orderBy(...))`를 이용하여 쿼리 객체를 생성하고, 그것을 `getDocs`에 대신 집어넣어 쿼리 수행.
      - 기대한대로 정렬되어 나옴을 확인.
- (확인) 확인 결과 모든 코드가 2회씩 실행되는 이유는 react에서 `StrictMode`로 app을 렌더링하도록 하고 개발 모드에서 작업하고 있었기 때문.
  - (정보) React는 개발 모드에서 혹시라도 발생할 수 있는 오류(무한 루프 등)를 파악하기 위해 미리 관련 코드들을 1회 실행켜보는 기능을 가지고 있다. 때문에 개발 모드에서는 모든 코드가 두번씩 실행되게 된다. 프로덕션 모드로 실행하면 검사용 순회를 생략하고 1번만 실행한다.
  - (결론) React의 기본 기능이고 도움이 되는 기능이므로 방치하도록 하며, 로그 등을 확인할 때 고려하도록 한다.
- `deleteDoc($DocumentReference)` 함수를 이용해서 데이터 삭제를 구현.
  - 정상적으로 document가 삭제됨을 확인.
- `setDoc($DocumentReference, $newValue)` 함수를 이용하여 데이터 갱신을 구현.
  - 갱신한 데이터가 view에서 사라지는 현상 발생. -> 확인 결과 입력으로 `text`만 제공하여 나머지 속성들을 제거하고 덮어써버린 것.
    - `{ ...docData, text: newText }`의 형태로 나머지 속성도 반영하여 오류 수정 -> 정상 동작 확인.
- `Contents` 파일 내 내용이 너무 복잡해져서 리펙토링 시도.
  - 데이터 수정 모드로 들어갈 시 사용하는 `form`을 `NweetBlack/NweetChangeForm.js`으로 분리.
    - 분리하고나니 상위 컴포넌트의 state에 직접 접근할 수 없게 됨. -> props로 set 함수 자체를 넘겨 하위 컴포넌트에서 호출하는 방식으로 해결
      - 검색해보니 이를 **pulling state**, 한글로는 **state 끌어올리기**라고 부르는 듯 함.