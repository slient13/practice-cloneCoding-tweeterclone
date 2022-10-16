import { fbDB } from "fbInstance/fbDB";
import fbStorage from "fbInstance/fbStorage";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import React, { useState } from "react"
import { v4 as uuid } from "uuid";  // 임의의 id 값을 만들어내기 위한 라이브러리.

export const NweetForm = ({ userId }) => {
    const [nweet, setNweet] = useState("");
    const [imageAttachment, setImageAttachment] = useState(undefined);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const imageUrl = `images/${uuid()}.jpg`;
            if (imageAttachment) {
                const storageRef = ref(fbStorage, imageUrl);
                uploadString(storageRef, imageAttachment, "data_url")
                    .then((result) => console.log({state: "upload success" , result}))
                    .catch((result) => console.log({state: "upload failure" , result}));
            }
            const data = {
                text: nweet,
                createdAt: new Date().toISOString(),
                creatorId: userId,
                imageUrl: imageAttachment ? imageUrl : "",
            };
            const docRef = await addDoc(collection(fbDB, "nweets"), data)
            setNweet("");
            setImageAttachment(undefined);
        } catch (e) {
            console.log("Error on adding document: " + e);
        }
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const imageFile = files[0];
        // https://developer.mozilla.org/ko/docs/Web/API/FileReader
        const reader = new FileReader()
        reader.onloadend = (event) => {
            const { currentTarget: { result } } = event;
            setImageAttachment(result);
        }
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        if (imageFile) reader.readAsDataURL(imageFile);
    }
    const onClearImage = () => {
        setImageAttachment(undefined);
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} value={nweet} placeholder="What's on your mind?" maxLength={120} /><br />
            <input type="file" accept="image/*" onChange={onFileChange} /><br />
            {imageAttachment && (<>
                <img src={imageAttachment} width="50px" height="50px" /><br />
                <button onClick={onClearImage}>reset</button><br />
            </>)}
            <input type="submit" value="send" />
        </form>
    )
}