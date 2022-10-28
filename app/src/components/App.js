import AppRouter from "./Router";
import { useLayoutEffect, useState } from "react";
import { fbAuth } from "fbInstance/fbAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { getUserProfileDB } from "util/userDB";
import { fbDB } from "fbInstance/fbDB";
import { LoginUserContext, UserDBContext } from "context/UserContext";
import styled, { createGlobalStyle, ThemeContext } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme === 'white' ? '#eee' : '#000'};
    color: ${props => props.theme === 'white' ? '#333' : '#ccc'};
  }
  a:link, a:active, a:hover, a:visited {
    color: ${props => props.theme === 'white' ? '#333' : '#ccc'};
  }  
`
const ChangeThemeButton = styled.button`  
  background-color: ${props => props.theme === 'white' ? '#eee' : '#000'};
  color: ${props => props.theme === 'white' ? '#333' : '#ccc'};
  position: fixed;
  top: 10px;
  right: 10px;
`
function App() {
  const auth = fbAuth;
  const [loginUserData, setLoginUserData] = useState({
    isLoaded: false,
    isLoggedIn: false,
    userObj: undefined,
    userId: undefined,
  });
  const [userDB, setUserDB] = useState({
    isLoaded: false,
    userDB: undefined,
  });
  const [themeData, setThemeData] = useState({
    theme: "dark",
  })
  const loadLoginUser = (user) => {
    setLoginUserData({
      isLoaded: true,
      isLoggedIn: Boolean(user),
      userObj: user,
      userId: user?.uid,
    });
  }
  const loadUserDB = async () => {
    const data = await getUserProfileDB();
    // console.log({data});
    setUserDB({
      isLoaded: true,
      userDB: data,
    });
  }
  useLayoutEffect(() => {
    // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    const id_onAuthStateChanged = auth.onAuthStateChanged((user) => {
      loadLoginUser(user);
    });
    const id_onSnapShot = onSnapshot(collection(fbDB, "UserDB"), () => {
      loadUserDB();
    })
    setThemeData({ theme: "dark" });

    return () => {
      id_onAuthStateChanged();
      id_onSnapShot();
    }
  }, [auth])
  const changeThemeMode = () => {
    if (themeData.theme === 'white') {
      setThemeData({ ...themeData, theme: "dark" });
    } else {
      setThemeData({ ...themeData, theme: "white" });
    }
  }

  return (
    <div className="App">
      <GlobalStyle theme={themeData.theme} />
      <ChangeThemeButton onClick={changeThemeMode} theme={themeData.theme}>
        {themeData.theme === 'white' ? 'White Mode' : 'Dark Mode'}
      </ChangeThemeButton>
      {loginUserData.isLoaded && userDB.isLoaded
        ? (<LoginUserContext.Provider value={loginUserData}>
          <UserDBContext.Provider value={userDB}>
            <ThemeContext.Provider value={themeData}>
              <AppRouter />
            </ThemeContext.Provider>
          </UserDBContext.Provider>
        </LoginUserContext.Provider>)
        : "Loading..."}
    </div>
  );
}

export default App;