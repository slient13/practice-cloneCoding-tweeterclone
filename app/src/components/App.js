import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { fbAuth } from "fbInstance/fbAuth";

function App() {
  const auth = fbAuth;

  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      } 
      setInit(true);
    });
  }, [])

  return (
    <div className="App">
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Loading..."}
    </div>
  );
}

export default App;
