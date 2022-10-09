import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { fbAuth } from "fbInstance/fbAuth";

function App() {
  const auth = fbAuth;

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {    
    // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);        
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])

  return (
    <div className="App">
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Loading..." }
    </div>
  );
}

export default App;
