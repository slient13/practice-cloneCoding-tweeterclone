import { fbDB } from "fbInstance/fbDB";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react"

export const NweetForm = ({userId}) => {
    const [nweet, setNweet] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {
                text: nweet,
                createdAt: new Date().toISOString(),
                creatorId: userId,
            };
            const docRef = await addDoc(collection(fbDB, "nweets"), data)
        }catch (e) {
            console.log("Error on adding document: " + e);
        }
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} value={nweet} placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" value="send" />
        </form>
    )
}