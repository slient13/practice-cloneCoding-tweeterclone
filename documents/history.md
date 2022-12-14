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

## chapter 4
- `Firebase Storage`를 사용하기 위한 기본 환경 설정을 행함.
  - `firebase init` 명령을 통해 `storage`도 사용하도록 설정 변경.
  - `firebase storage`에 대한 접근을 위해 `fbStorage.js`라는 파일을 만들고, `fbStorage`라는 객체를 참조할 수 있도록 제공.
- `NweetForm.js`에서 이미지 업로드 기능을 포함하도록 수정.
  - `<input type="file" accept="image/*" ... />`을 이용해 입력으로 이미지를 넣을 수 있도록 제공.
  - `FileReader`를 이용해 이미지를 읽어들임.
    - `event.target.file`에서 이미지를 추출. 
    - `.ReadAsDataURL(...)`을 통해 해당 값을 **dataURL** 형식으로 읽어들임.
    - `.onloadend(...)`를 통해 로딩이 끝나면 실행하는 콜백을 지정.
      - 해당 콜백에서는 결과로 반환된 값에 대해 `event.currentTarget.result` 값을 읽음으로써 **dataURL** 형식으로 표현된 이미지 값을 추출.
  - 읽어들인 이미지를 `<img />`로 `50*50 px` 사이즈로 화면에 띄워줌.
  - 업로드한 이미지를 취소하는 기능 등을 추가.
  - 정상 동작 확인.
- 위에서 선택한 이미지를 `Firebase Storage`에 업로드하는 기능 구현.
  - `fbStorage` 객체를 이용하여 접근 권한 획득.
    - `uuid`를 이용하여 임의의 id 값을 생성해내고 이를 이용해 참조자를 생성.
  - `uploadString($ref, $string)` 함수를 이용해서 위에서 **dataURL** 형태로 변환한 값을 업로드하는 코드를 작성.
  - **Firestore**에 등록되는 `nweet`의 내용 중 이미지 url에 대한 정보를 추가.
  - (오류) 업로드 테스트 시 권한 문제가 발생함을 확인.
    - 해결 방법 검색: https://fomaios.tistory.com/entry/Firebase-Storage-Error-User-does-not-have-permission-to-accss
      - 위 내용을 참고할 때 `rule`에 대한 문제라 판단됨. 다만, 보안을 위해 접근을 제어하는 코드를 함부로 없얘고 싶지는 않음.
    - 추가 검색: https://firebase.google.com/docs/storage/security
      - `if false`를 `if request.auth != null;`로 수정
      - 권한 문제가 해결되고 정상적으로 업로드됨을 확인.
- 업로드한 사진을 다시 내려받아 출력하는 기능 구현
  - `nweet.imageUrl` 정보를 이용하여 `getDownloadUrl()` 함수를 이용해 다운로드 가능한 링크를 확보.
  - `<img src={$downloadUrl} />`을 이용하여 화면에 출력하도록 설정.
    - (오류 발생) 사진이 로드되지 않음.
    - (분석) **Firebase Storage**에 저장된 데이터 유형이 이상함.
      - (분석) **NweetForm**에서 `uploadString`을 통해 업로드할 때 어떤 유형의 문자열인지를 명시하지 않았음을 확인.
      - (해결) `uploadString(..., ..., "data_url")`으로 내용 수정.
        - (확인) 제대로 이미지 파일로 인식됨을 확인.
    - (확인) 사진이 정상적으로 출력됨을 확인
- nweet 수정 기능에 대해 이미지까지 수정할 수 있도록 기능 향상.
  - 파일 업로드 기능 추가
    - `NweetForm.js`와 유사한 방법으로 파일 추가.
    - (오류) 파일과 데이터 자체는 잘 업로드 되지만 파일의 변경 사항이 반영되지 않음.
      - (분석) 이미지 파일 등을 출력해야 하는 `NweetBlock`의 `loadImage` 함수가 제대로 실행되지 않고 있는 것을 확인.
      - (분석) `NweetBlock.js`는 state를 끌어올려 구현하였는데 이로 인해 `useEffect(..., [])` 안에 넣어놨던 `loadImage` 함수가 실행되지 않았던 것.
        - (해결) `useEffect(..., [isChangeMode])`로 코드를 바꾸어 `isChangeMode`에는 반응하도록 설정.
      - (문제) 이렇게 구현하니 수정 모드로 진입할 때도 발동됨.
        - (해결) `!isChangeMode && loadImage()`로 코드를 고쳐서 수정 모드에서 돌아올 때만 발동되도록 함.
      - (문제) 수정을 취소하고 돌아오는 경우에도 불필요하게 렌더링이 발생함
        - (추후 해결 예정)
  - 기존 이미지 제거 기능 추가.
    - 기존에 이미지가 있었던 경우(`docData.imageUrl`이 빈 문자열이 아닌 경우) 초기화 버튼이 뜨도록 구현.
    - `remainImage`이라는 state를 누어 `docData`를 갱신할 때 `.imageUrl` 값을 유지할지 빈 문자열로 덮어쓸지를 구분하도록 함.
    - (오류) 이미지 제거는 잘 되는데 이후 같은 데이터에 새로운 이미지를 등록하려고 하면 잠시동안 이전 이미지가 보였다가 전환됨.
      - (추후 해결 예정)
    - (오류) 이미지 제거를 중간에 섞어서 이미지 수정을 테스트하다보면 종종 이미지가 갱신되지 않는 현상이 생김.
      - (추후 해결 예정)
  - (오류) nweet 중 하나의 이미지만 수정했음에도 전체 nweet이 다시 렌더링 되고, 그에 따라 비효율적인 이미지 로드가 발생함을 확인.
    - (추후 해결 예정)
- 전날 파악된 이슈 해결.
  - (이슈-해결됨) 수정을 취소하고 돌아오는 경우에도 불필요하게 이미지 로드가 발생함.
    - (수정) `useRef`를 사용하여 이전 상태의 `docData.imageUrl`을 기억하도록 하고, 재 랜더링 시 변화가 없으면 이미지 로드를 생략하도록 함.
  - (이슈-해결됨) nweet 중 하나의 이미지만 수정했음에도 전체 nweet이 다시 렌더링 되고, 그에 따라 비효율적인 이미지 로드가 발생함을 확인.
    - (수정) contents 부분에서 기존에는 state에 표현할 컴포넌트 형태를 저장해두었다가 출력하도록 했는데, 이를 데이터만 저장하도록 하고 렌더링 함수 부분(return 부분)에서 즉석으로 컴포넌트를 생성하도록 수정.
      - (확인) 데이터가 추가되거나 일부 데이터를 수정해도 변경된 부분만 렌더링 됨을 확인
  - (이슈-해결됨) 이미지 제거를 중간에 섞어서 이미지 수정을 테스트하다보면 종종 이미지가 갱신되지 않는 현상이 생김.
    - (테스트) 이미지를 제거했다가 다시 새로운 이미지를 할당했을 때 이미지를 로드하는 함수에서 `imageUrl`이 비어있는 것으로 나옴. 새로고침하면 정상적으로 반영됨.
      - (분석) 이미지를 수정한 경우 DB에 변경된 url을 갱신하고, 갱신된 DB가 `onSnapshot` 이벤트를 실행시켜 정보를 다시 불러오는 과정을 거쳐서 화면을 갱신해주는데, 데이터를 받아오기 전에 이미지 로드를 시도하고 그 뒤로는 실행되지 않아 빈 사진이 띄워지는 것으로 파악됨.
    - (수정) `NweetBlock.loadImage`가 포함된 `useEffect`의 발생 조건을 `isChangeMode`에서 `docData.imageUrl`으로 변경. 즉, 이미지 url이 변경된 경우에 한해 갱신 동작이 발동되도록 변경.
      - (확인) 이미지를 삭제했다가 다른 이미지로 교체한 경우, 삭제를 생략하고 다른 이미지로 교체한 경우 모두 제대로 변경사항이 반영됨을 확인.
  - (이슈) 이미지 제거는 잘 되는데 이후 같은 데이터에 새로운 이미지를 등록하려고 하면 잠시동안 이전 이미지가 보였다가 전환됨.
    - (분석) 이전의 다운로드 링크가 남아있던 상태에서 중간에 다운로드 링크를 변경하기 때문에 잠깐 보여지는 것으로 예상됨. 즉, 렌더링 이후 다시 갱신 작업을 하다보니 발생하는 문제로 추정.
    - (수정) `useEffect` 대신 렌더링 이전에 업데이트를 마치도록 설정된 `useLayoutEffect`를 사용.
    - (확인) 바로 새로운 이미지로 변경되어 출력됨을 확인.
- (이슈-해결됨) 이미지 파일을 업로드하고 수정하고 하다보니 계속 새로운 이미지가 **storage**에 쌓여 불필요한 저장공간 낭비를 야기하고 있음.
  - (분석) 이미지를 제거하거나 변경할 때 기존 이미지를 삭제하면 될 듯. 현재 기준 특별히 기존 이미지를 남겨두어야 할 이유가 없음.
  - (수정) imageUrl을 변경하는 수정 작업시 DB에 저장된 기존 이미지를 삭제하도록 코드 추가
    - (확인) 불필요한 이미지가 DB에 남아있지 않으며, 이미지를 등록한 nweet들은 정상적으로 이미지가 표현됨.
  - (이슈-해결됨) nweet을 삭제할 때는 이미지가 같이 따라 삭제되지 않음.
    - (수정) `NweetBlock.js`의 `onDelete` 함수의 내용에 `deleteObject` 관련 코드 추가.
      - (확인) nweet을 삭제할 때 이미지도 같이 삭제됨.

## chapter 5
- (기획-구현됨) **Profile** 탭의 기능을 개선
  - (기획-구현됨) **내가 쓴 nweet 목록**을 모아 보거나 수정할 수 있도록 제공.
    - (수정) `NweetBlock`을 재사용하여 질의 형태만 바꾼 데이터를 제공함으로써 기능 구현.
      - (확인) 각자 자신이 작성한 nweet들만 목록에 나타남.
  - (기획-구현됨) user의 닉네임이 변경되는 경우 모든 유저들에게 **nweet**의 작성자 명칭이 바뀌도록 수정.
    - (개발) `userData`라는 firestore collection을 추가. 해당 컬렉션에는 전체 유저들에 대한 정보가 기록됨.(현재 기준으로는 displayName 뿐) `document id`는 `User.uid`
    - (개발) 위 DB에서 user들의 displayName을 받아오고, 매칭되는 경우가 존재하면 대체하도록 설정.(관련 함수는 `util/userDB.js`로 분리함)
      - (확인) 기존의 복잡한 uid 대신 사용자가 직접 지정한 displayName으로 대신 표기되는 것을 확인.
      - (이슈-해결됨) 유저 정보들은 모든 nweet 통틀어 하나만 있으면 되는데 매 nweet 마다 불러오는 코드가 발생해 비효율적
        - (수정) 내부의 유저 정보 관련 코드를 분리해서 최상위 컴포넌트인 `App.js`에 옮겨넣고, **props drilling**을 통해 전달
          - (확인) 정상 동작.
      - (이슈-해결됨) 데이터를 내려받기 전까지 잠깐동안 내용이 빈칸으로 나오는 문제 발생.
        - (확인) 상단 이슈를 해결하는 과정에서 같이 해결됨.
  - (기획-구현됨) user 닉네임이나 프로필 사진을 변경할 수 있도록 기능 제공. (수정) 프로필 사진 업로드는 제외
    - (개발) 작은 form 형태를 만들어 기능 구현.
      - (확인) 정상적으로 닉네임이 변경되며, 변경시 자동으로 다른 유저의 화면에서도 변경사항이 갱신됨.
- (이슈-해결됨) `edit` 버튼을 누르는 경우 비정상적으로 많은 횟수의 `Contents` 및 `MyNweets` 렌더링이 발생.
  - (테스트) `Home`이랑 `Profile`을 오가면서 테스트 해보니 오가는 횟수가 늘 수록 의미 없는 렌더링의 횟수도 늘어남. 새로고침하면 초기화.
  - (테스트) `NweetBlock`의 렌더링을 테스트해본 결과 렌더링은 이루어지지 않음을 확인. 그리고 상위 컴포넌트들의 주석 위치를 확인해보니 렌더링 체크용이 아니라 `onSnapShot` 내부에 들어가 있는 것.
    - (분석) 컴포넌트가 제거되면 그에 연결되어 있던 리스너도 같이 제거되어야 하는데 그것은 제거되지 않고 남아서 무의미하게 데이터 조회를 시도하는 듯.
  - (검색) react의 `useEffect`로 넣어주는 callback 함수는 반환값으로 또다른 콜백 함수를 지정할 수 있는데, 이를 통하면 `useEffect`로 인한 영향의 후처리를 지정해줄 수 있음. (unmount 시 발동)
    - (참고) https://react.vlpt.us/basic/16-useEffect.html
  - (검색) firebase의 `onSnapshot` 함수는 자체적으로 콜백 함수를 반환하는데, 이 함수를 실행하면 리스너가 분리됨. 아마 다른 리스너들도 동일한 구성을 가지고 있을 듯.
    - (참고) https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
  - (수정) `useEffect`의 반환값으로 리스너들을 제거하도록 함.
    - (확인) 문제가 해결됨. 덤으로 기존에 2번씩 갱신 로그가 찍혔는데 이로 인한 문제도 해결됨.
- (이슈-해결됨) 개발하고 리펙토링 하던 중 사용하지 않고 무시된 코드들이 다수 있는 것으로 판단됨. 정리 필요.
  - (처리) 각 파일을 돌면서 사용되지 않음에도 import 된 모듈이나 함수 등을 제거함.

## chapter 6
- (기획-구현됨) Firebase hosting을 통해 개발한 사이트를 외부 다른 기기에서 접속할 수 있도록 제공.
  - (기획-구현됨) **local emulator suite**를 이용하여 로컬 환경에서 hosting 테스트.
    - (개발) `npm run build` 명령으로 react 개발분을 빌드 실행.
    - (개발) `firebase init hosting`으로 호스팅 환경 설정
      - (확인) **Local Emulator Suite**에서 실행시켜보니 404 페이지가 뜨는 것을 확인.
      - (테스트) `/index.html`을 주소창에 추가로 입력해주니 기존에 보던 페이지가 확인됨.
      - (검색) hosting 옵션에는 추가적인 것이 있음을 확인. 그 중 **rewrites** 속성이 필요할 듯. 
        - (참고: https://firebase.google.com/docs/hosting/full-config?hl=ko)
    - (수정) `firebase.json.hosting` 부분에 `rewrites: [{source: "**", destination: "/index.html"}]`을 추가해줌.
      - (확인) 정상적으로 화면이 출력됨을 확인.
  - (기획-구현됨) 본 hosting 서비스에 올려보고 접속 시도. 사용량 분석.
    - (개발) `firebase deploy --only hosting` 명령을 입력.
      - (확인) 명령 실행이 끝나고 제공된 `Hosting URL`을 통해 접속이 가능함을 확인.
      - (확인) 개발 컴퓨터가 아닌 전혀 다른 컴퓨터에서도 정상적으로 접속이 가능함을 확인.
    - (확인) 몇 번의 테스트 후 다음의 결과값을 얻었음. 리소스 소모량도 정상.
      - (Firestore)
        - 읽기: (29건/5만건)/일
        - 쓰기: (2건/2만건)/일
      - (호스팅)
        - 저장 용량: (21.3KB/10GB)/월
        - 다운로드: (251.4KB/10GB)/월
- (이슈-해결됨) 로그아웃 버튼이 정상 동작하지 않음.
  - (테스트) `Log Out` 버튼을 누르고 난 뒤 새로고침을 해보니 `Home` 페이지에서는 인증 페이지로, `Profile` 페이지에서는 오류가 발생함.
    - (분석) `Auth.signOut` 함수 자체는 정상적으로 동작하나, 실행 후 새로고침이나 리다이렉션 기능이 존재하지 않는 것이 문제인 듯.
  - (테스트) `Profile`의 로그아웃 직후 로그 분석.
    - (확인) 로그아웃에 따른 redirection이 이루어지기 전에 `userObj`에 대한 참조가 발생하여 `referenceError`가 발생하고 이후 코드가 중단된 것.
    - (수정) `isLoggedIn` 값이 true일 때만 각 컴포넌트를 렌더링하도록 하여 비정상적인 참조를 방지.
      - (확인) 정상적으로 `Log Out` 버튼을 누르자마자 로그인 페이지로 이동됨.
  - (빌드-완료)
  - (배포-완료)

## 추가 실습
- (계획-구현됨) **Context API** 혹은 **Redux**를 적용하여 비효율적으로 깊은 **props drilling**을 refactoring.
  - (수정) **Context API**를 이용하여 user와 관련된 정보를 직통으로 전달하도록 변경
    - (확인) 전반적인 실행 오류가 발생. 로그인이 되지 않는다던지, 닉네임 교환이 제대로 되지 않는다던지 등등.
      - (분석) **Context** 값이 변경되면 이를 구독하고 있는 컴포넌트들도 자동으로 렌더링이 다시 수행되는데, 이로 인해 제대로 정보가 갖추어지지 않은 상태에서 데이터가 전파된 것으로 보임.
  - (수정) 로그인한 유저에 대한 정보(인증 정보 관련)와 유저들에 대한 정보(DB 관련)를 별도의 context로 분리해서 관리
  - (수정) userProfile 정보에 대한 수정을 별도로 분리
  - (수정) App 렌더링 조건을 별도로 두는 대신 Context에 전달할 정보들에 첫 수신 여부를 판단할 수 있도록 하고 그것을 이용.
    - (확인) 문제가 해소됨.
- (이슈) **nweet** 들이 뜨는 속도가 신경쓰이게 느림.
  - (수정) contents 정보를 불러오는 코드를 별도의 싱글톤 클래스로 분리하고, 일종의 리스너를 만들어 변경사항만 전파되도록 설정. `MyNweets`는 동일한 값을 받되 동적으로 정렬하도록 구성.
    - (확인) **Home**과 **Profile**을 오갈 때마다 무의미하게 DB 질의하던 것이 사라짐. 속도가 매우 빨라짐.
  - (이슈-해결됨) 새로 추가한 nweet의 이미지가 나오지 않음.
    - (분석) 로그를 보면 이미지 업로드 -> 다운로드보다 페이지 갱신이 빨라서 DB에 이미지가 없는 것으로 인식되었기 때문.
    - (테스트) 추가로 이미지를 등록하거나 수정하거나 등등을 수행 -> 정상적으로 나옴.
      - (분석) 초기화 상태에서 DB가 존재하지 않아서 리스너가 작동하지 않는 것. 정식 서비스에서 DB가 없을리는 없으니 문제 없을 듯.
- (계획-완료) css를 적용하여 실습 영상과 유사한 형태로 결과 페이지 디자인 개선.
  - (계획-완료) **styled components**를 적용하여 CSS를 적용할 수 있도록 준비.
  - (계획-완료) 강의 영상을 참고하여 디자인 적용. 단, 너무 똑같이 모사하지는 말고 가능하면 직접 디자인을 적용해볼 것.
    - (계획-완료) 인증 페이지 모사
      - (비고) 상단 이미지는 생략
    - (계획-완료) 홈 페이지 모사
      - (계획-완료) **NweetForm** 모사
      - (계획-참조) nweetblock 모사
    - (계획-완료) nweetblock 모사
      - (계획-완료) 기본 디자인 모사
      - (계획-완료) 수정, 삭제 버튼 모사
      - (계획-완료) 수정 페이지 모사
    - (계획-완료) 프로필 페이지 모사
      - (계획-완료) profile 변경부, 로그아웃 버튼 모사.
      - (계획-참조) nweetblock 모사
- (계획-완료) 앞서 적용한 모든 CSS를 **theme**에 따라 `white/dark` 모드로 전환할 수 있도록 설정.
  - (계획-완료) **white 모드**용 디자인 적용.
  - (계획-완료) 전환용 버튼과 관련 기능 추가.

## 실습 정리
- (계획) 포트폴리오 작성
  - (계획) 모든 기능을 확인할 수 있도록 데이터 사전 입력.
    - (목록) 테스트 계정의 일반 입력
    - (목록) 테스트 계정의 사진 포함 입력
    - (목록) 다른 계정의 입력
    - (목록) 변경 실습용 입력
    - (목록) 삭제 실습용 입력
  - (계획) 각 기능을 사진을 포함하여 표현.
  - (계획) 해당 실습을 진행하면서 사용한 기술들을 정리.

# end