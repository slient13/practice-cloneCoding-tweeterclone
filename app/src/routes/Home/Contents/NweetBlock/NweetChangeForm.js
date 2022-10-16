import { useState } from "react";
import { uuidv4 } from "@firebase/util";
import { deleteObject, ref, uploadString } from "firebase/storage";
import fbStorage from "fbInstance/fbStorage";

const { fbDB } = require("fbInstance/fbDB");
const { setDoc, doc } = require("firebase/firestore");


export const NweetChangeForm = ({ docId, docData, setIsChangeMode }) => {
    const [text, setText] = useState(docData.text);
    const [remainImage, setRemainImage] = useState(!(docData.imageUrl === ""))
    const [imageAttachment, setImageAttachment] = useState(undefined);
    const onSubmit = async (event) => {
        event.preventDefault();
        let data = {
            ...docData,
            text: text,
        };
        if (remainImage) { }
        else if (!imageAttachment) { 
            data.imageUrl = ""; 
            !(docData.imageUrl === "") && await deleteObject(ref(fbStorage, docData.imageUrl));
        }
        else {
            try {
                const imageUrl = `images/${uuidv4()}.jpg`
                await uploadString(ref(fbStorage, imageUrl), imageAttachment, "data_url");
                data.imageUrl = imageUrl;
                console.log({ state: "upload success", imageUrl: data.imageUrl });
                await deleteObject(ref(fbStorage, docData.imageUrl));
            } catch (e) {
                console.log({ state: "upload fail", e });
            }
        }
        await setDoc(doc(fbDB, "nweets", docId), data);
        setIsChangeMode(false);
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setText(value);
    }
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const imageFile = files[0];
        if (!imageFile) setImageAttachment(undefined);
        // https://developer.mozilla.org/ko/docs/Web/API/FileReader
        const reader = new FileReader()
        reader.onloadend = (event) => {
            const { currentTarget: { result } } = event;
            setImageAttachment(result);
        }
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        if (imageFile) reader.readAsDataURL(imageFile);
        if (remainImage) setRemainImage(false);
    }
    const onDeleteImage = (event) => {
        event.preventDefault();
        setRemainImage(false);
    }

    return (<>
        <form onSubmit={onSubmit}>
            <input
                name="text" type="text" placeholder="Write new contents" defaultValue={text}
                onChange={onChange}
                required></input>
            <input type="file" onChange={onFileChange} />
            {remainImage ? <button onClick={onDeleteImage}>remove image</button> : ""}
            <input type="submit" value="save" />
        </form>
        <button onClick={() => setIsChangeMode(false)}>cancel</button>
    </>)
}