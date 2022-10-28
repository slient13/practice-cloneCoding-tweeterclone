import { uuidv4 } from "@firebase/util";
import { fbDB } from "fbInstance/fbDB";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

class Nweet {
    /** @type {string} */
    text;
    /** @type {string: Date.ISOString} */
    createdAt;
    /** @type {userId: string} */
    creatorId;
    /** @type {url: string} */
    imageUrl;
}

class NweetsDB {
    static #instance = null;
    /**
     * @type {{id: string, data: Nweet}[]}
     */
    #data;
    /**
     * @type {{id: string, unsubscribe: callback: (data) => void}[]}
     */
    #eventCallbackList;
    constructor() {
        if (NweetsDB.#instance) return NweetsDB.#instance;
        NweetsDB.#instance = this;
        this.#data = [];
        this.#eventCallbackList = [];
        this.onSnapshotUnsubscribe = onSnapshot(collection(fbDB, "nweets"), async () => {
            console.log("NweetsDB: Contents Refresh");
            const queryData = await getDocs(query(collection(fbDB, "nweets"), orderBy("createdAt", "desc")));
            let output = [];
            queryData.forEach((doc) => {
                const [id, data] = [doc.id, doc.data()]
                output.push({ id, data })
            })
            this.#data = output;
            this.#eventCallbackList.forEach(e => e.callback(this.#data))
        });
    }
    /**
     * @param {string} callbackId 
     */
    #unsubscribe(callbackId) {
        this.#eventCallbackList = this.#eventCallbackList.filter(e => e.id !== callbackId);
    }
    getNweets() {
        return this.#data;
    }
    /**
     * 
     * @param {(docData: {id: string, data: Nweet}[]) => void} callback 
     * @return {unsubscribe}
     */
    addSubscribe(callback) {
        const callbackId = uuidv4();
        this.#eventCallbackList.push({
            id: callbackId,
            callback: (data) => callback(data),
        })
        callback(this.getNweets());
        return () => this.#unsubscribe(callbackId)
    }

    unmount() {
        this.onSnapshotUnsubscribe();
        NweetsDB.#instance = null;
    }
}

/**
 * 
 * @param {(docData: {id: string, data: Nweet}[]) => void} callback 
 * @return {unsubscribe}
 */
export const addSubscribe = (callback) => {
    const nweetsDB = new NweetsDB();
    return nweetsDB.addSubscribe(callback);
}