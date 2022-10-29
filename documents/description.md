# 목차
- [목차](#목차)
- [사용한 기술 개요](#사용한-기술-개요)
- [인증 페이지](#인증-페이지)
  - [계정 생성](#계정-생성)
  - [로그인](#로그인)
- [홈페이지](#홈페이지)
  - [Nweet 추가](#nweet-추가)
  - [Nweet 출력](#nweet-출력)
  - [Nweet 수정](#nweet-수정)
- [프로필 페이지](#프로필-페이지)
  - [닉네임 변경](#닉네임-변경)
  - [로그아웃](#로그아웃)
  - [작성한 Nweet 출력](#작성한-nweet-출력)

본 실습 프로젝트의 기능 및 기능별 사용된 기술을 정리한 문서이다.

# 사용한 기술 개요
- **FrontEnd**: React(hooks)
	- **State 관리**: React.ContextAPI
	- **Style**: styled component
- **BackEnd**: firebase
	- **Authociation**: firebase.Authociation
	- **Database**: firebase.Firestore
	- **Storage**: firebase.Storage
	- **TestEnvironment**: firebase.LocalEmulatorSuite
- etc
	- **Editor**: visual studio code
	- **소스코드 공유 및 버전 관리**: git
# 인증 페이지
## 계정 생성
이메일+비밀번호를 통한 계정 생성 혹은 google/github를 통한 소셜 계정 생성을 지원한다.

**firebase**의 **Authociation** 로 구현하였다. `createUserWithEmailAndPassword`를 이용하여 이메일, 비밀번호를 통한 계정 생성을, `GoogleAuthProvider`와 `GithubAuthProvider`, 그리고 `signInWithPopup`을 통해 소셜 계정 생성을 구현하였다.

참고
- [createAccountPage_white](image/1.2_createAccountPage_white.jpeg)
- [Authociation.js](../app/src/routes/Authociation.js)

## 로그인
이메일+비밀번호를 통한 로그인 혹은 google/github를 통한 소셜 로그인을 지원한다.

**firebase**의 **Authociation** 기능을 이용하여 구현하였다. `signInWithEmailAndPassword`을 이용하여 이메일, 비밀번호를 직접 입력한 로그인을, `GoogleAuthProvider`와 `GithubAuthProvider`, 그리고 `signInWithPopup`을 통해 소셜 로그인을 구현하였다.

참고
- [loginPage_white](image/1.0_loginPage_white.jpeg)
- [loginPage_dark](image/1.1_loginPage_dark.jpeg)
- [Authociation.js](../app/src/routes/Authociation.js)

# 홈페이지
## Nweet 추가
상단 입력창에 텍스트를 입력하고 제출하면 등록된다. 입력할 때 이미지를 포함하면 이미지도 같이 등록된다.

*Nweet*의 저장을 위한 DB는 **firebase**의 **Firestore**로 구현하였다. `addDoc`을 이용해 문서를 추가하였다. 이미지가 추가된 경우 *Nweet*에는 이미지의 *url*만 저장하고 실 내용은 별도로 저장하였다. 이 때 사용하는 클라우드 저장공간은 **Storage**를 이용해 구현하였다. 이미지는 **dataURL** 읽어들여 `uploadString`을 통해 텍스트 형태로 저장하였다.

참고
- [homePage_white](image/2.0_homePage_white.jpeg)
- [homePage_dark](image/2.1_homePage_dark.jpeg)
- [NweetForm.js](../app/src/routes/Home/NweetForm.js)

## Nweet 출력
DB에 저장된 *Nweet*이 있다면 전부 출력해준다. *Nweet*은 작성자를 *uid*으로 기록하고 있는데, 출력할 때는 *uid*가 아닌 해당 유저의 닉네임을 대신 출력해준다.

만약 해당 *Nweet*이 본인이 작성한 것이라면(`작성자 uid`와 `로그인한 유저 uid`가 동일하다면) 수정 및 삭제 버튼이 추가로 표시되며, 해당 버튼을 눌러 수정, 삭제를 수행할 수 있다. (자세한 것은 [Nweet 수정](#nweet-수정) 참고)

**firebase**의 **Firestore** 및 **Storage** 기능을 이용하여 구현하였다. `onSnapshot`을 통해 변경사항이 발생했을 때 실시간으로 반영되도록 하였고, `getDocs`를 이용해 데이터를 받아왔으며, `query`를 통해 받아올 때 데이터를 생성 일자 순으로 조회하도록 하였다. 이미지 url이 존재하는 경우 `getDownloadURL`을 통해 다운로드 링크를 받아내어 출력하였다.

Nweet의 출력은 `contents.js` 뿐만 아니라 `myNweets.js`에서도 수행하기 때문에 불필요한 질의를 방지하고자 별도로 해당 데이터를 조회하고 최신화하는 싱글톤 객체를 두었다.

참고
- [homePage_white](image/2.0_homePage_white.jpeg)
- [homePage_dark](image/2.1_homePage_dark.jpeg)
- [Contents.js](../app/src/routes/Home/Contents.js)
- [NweetBlock.js](../app/src/routes/Home/Contents/NweetBlock.js)
- [NweetsDB.js](../app/src/db/NweetsDB.js)

## Nweet 수정
만약 *Nweet*의 작성자가 현재 로그인한 유저와 동일하다면 *Nweet*의 내용을 수정하거나 *Nweets* 자체를 삭제할 수 있다.

수정은  **firebase.Firestore**의 `setDoc`을 이용해서 구현하였고, 삭제는 `deleteDoc`을 이용해 구현하였다. 만약 이미지가 다른 이미지로 교체되거나, 제거되거나, *Nweet* 자체가 삭제된 경우에는 `deleteObject`을 통해 기존 이미지에 대한 정보도 삭제시켜 용량을 아끼도록 했다.

참고
- [homePage_white](image/2.0_homePage_white.jpeg)
- [homePage_dark](image/2.1_homePage_dark.jpeg)
- [NweetBlock.js](../app/src/routes/Home/Contents/NweetBlock.js)
- [NweetChangeForm.js](../app/src/routes/Home/Contents/NweetBlock/NweetChangeForm.js)

# 프로필 페이지
## 닉네임 변경
변경할 닉네임을 전송하면 닉네임을 수정해준다. 제출하면 바로 닉네임이 수정되며, *Nweet*이나 로그인한 유저 표시칸도 즉시 갱신된다.

**firebase**의 **Authociation**을 이용해 *uid*를 얻어내고, **Firestore**에서 *uid*와 닉네임을 연결해주는 DB를 두는 식으로 구현하였다.

참고
- [profilePage_changeDisplayName_white](image/3.2_profilePage_changeDisplayName_white.jpeg)
- [profilePage_changeDisplayName_after_white](image/3.3_profilePage_changeDisplayName_after_white.jpeg)
- [EditProfile.js](../app/src/routes/EditProfile.js)

## 로그아웃
로그아웃 버튼을 누르면 로그인 상태가 해제된다. 

**firebase.Authociation**의 `signOut`을 이용하여 구현하였다.

참고
- [profilePage_white](image/3.0_profilePage_white.jpeg)
- [profilePage_black](image/3.1_profilePage_black.jpeg)
- [Profile.js](../app/src/routes/Profile.js)

## 작성한 Nweet 출력
[Nweet 출력](#Nweet-출력)과 유사하나 `NweetsDB`로 얻는 결과물에 필터를 적용하여 현재 로그인한 작성자가 작성한 *Nweet*만을 출력하도록 했다. 사용한 기술은 동일하다.

참고
- [profilePage_white](image/3.0_profilePage_white.jpeg)
- [profilePage_black](image/3.1_profilePage_black.jpeg)
- [MyNweets.js](../app/src/routes/Profile/MyNweets.js)