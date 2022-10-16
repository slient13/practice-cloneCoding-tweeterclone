import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { fbAuth } from "fbInstance/fbAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { userProfileDB } from "util/userDB";
import { fbDB } from "fbInstance/fbDB";

function App() {
  const auth = fbAuth;

  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [userProfileData, setUserProfileData] = useState(undefined);
  useEffect(() => {
    // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    auth.onAuthStateChanged((user) => {
      user && setUserObj(user);
      setInit(true);
    });
    onSnapshot(collection(fbDB, "userData"), () => {
      loadDisplayName();
    })
  }, [])
  const loadDisplayName = async () => {
    const data = await userProfileDB();
    // console.log({data});
    setUserProfileData(data);
  }

  return (
    <div className="App">
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} userProfileData={userProfileData}/> : "Loading..."}
    </div>
  );
}

export default App;
