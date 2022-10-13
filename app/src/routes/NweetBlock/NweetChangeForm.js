import { useState } from "react";

const { fbDB } = require("fbInstance/fbDB");
const { setDoc, doc } = require("firebase/firestore");


export const NweetChangeForm = ({ docId, docData, setIsChangeMode }) => {
    const [text, setText] = useState(docData.text);    
    const onSubmit = async (event) => {
        event.preventDefault();
        await setDoc(doc(fbDB, "nweets", docId), {            
            ...docData,
            text: text            
        });
        setIsChangeMode(false);
     }
    const onChange = (event) => {
        const { target: { value } } = event;
        setText(value);
    }

    return (<>
        <form onSubmit={onSubmit}>
            <input
                name="text" type="text" placeholder="Write new contents" defaultValue={text}
                onChange={onChange}
                required></input>
            <input type="submit" value="save" />
        </form>
        <button onClick={() => setIsChangeMode(false)}>cancel</button>
    </>)
}