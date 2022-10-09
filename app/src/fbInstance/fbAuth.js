/*
reference: {
    filebase.auth tutorial: https://firebase.google.com/docs/reference/node/firebase.auth
    filebase 인증 start tutorial: https://firebase.google.com/docs/auth/web/start
}
*/
import fbApp from "./fbApp";
import { getAuth } from "firebase/auth";

export const fbAuth = getAuth(fbApp);