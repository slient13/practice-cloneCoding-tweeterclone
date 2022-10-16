import { fbDB } from "fbInstance/fbDB"
import { collection, getDocs } from "firebase/firestore"

export const userDB = async () => {
    let userDB = {};
    const queryData = getDocs(collection(fbDB, "userData"));
    (await queryData).forEach((doc) => {
        const id = doc.id;
        userDB[id] = doc.data();
    })
    return userDB;
}

export const userProfileDB = async () => {
    let userProfileDB = {};
    const _userDB = await userDB();
    for (const [key, value] of Object.entries(_userDB)) {
        userProfileDB[key] = { displayName: value.displayName };
    }
    return userProfileDB;
}

/*
local emulator suite 에서 테스트할 때 사용하는 기본값.
*/