import fbApp from "./fbApp";
// reference: https://firebase.google.com/docs/firestore/quickstart#web-version-9
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"

let fbDB

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
    fbDB = getFirestore();
    connectFirestoreEmulator(fbDB, 'localhost', 8080);
}
else {
    fbDB = getFirestore(fbApp);
}

export {fbDB};