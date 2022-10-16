import fbApp from "./fbApp";
import { connectStorageEmulator, getStorage } from "firebase/storage";

let fbStorage

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
    fbStorage = getStorage();
    connectStorageEmulator(fbStorage, 'localhost', 9199);
}
else {
    fbStorage = getStorage(fbApp, "gs://firsttestapp-songline.appspot.com/");
}

export default fbStorage;