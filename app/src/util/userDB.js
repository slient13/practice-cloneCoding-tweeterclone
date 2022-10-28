import { fbDB } from "fbInstance/fbDB"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"

const userDBName = "UserDB"

export const getUserDB = async () => {
    let userDB = {};
    const queryData = getDocs(collection(fbDB, userDBName));
    (await queryData).forEach((doc) => {
        const id = doc.id;
        userDB[id] = doc.data();
    })
    return userDB;
}

export const getUserProfileDB = async () => {
    let userProfileDB = {};
    const _userDB = await getUserDB();
    for (const [key, value] of Object.entries(_userDB)) {
        userProfileDB[key] = { displayName: value.displayName };
    }
    return userProfileDB;
}

/**
 * 
 * @param {string} uid // user id
 * @param {string} newName // display name want to chagne
 */
export const setUserProfile = (uid, newName) => {
    setDoc(doc(fbDB, userDBName, uid), {
        displayName: newName,
    });
}