import { LoginUserContext } from "context/UserContext";
import { fbDB } from "fbInstance/fbDB";
import fbStorage from "fbInstance/fbStorage";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import React, { useContext, useState } from "react"
import styled, { ThemeContext } from "styled-components";
import { v4 as uuid } from "uuid";  // 임의의 id 값을 만들어내기 위한 라이브러리.

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    /* border: 1px solid #ccc;
    border-radius: 10px; */
    padding: 10px;
`
const NweetInputField = styled.div`
    width: 70%;
    display: flex;
    margin-bottom: 15px;

`
const NweetInput = styled.input`
    width: 100%;
    border-radius: 25px;
    border: none;
    padding: 0px 10px;
    height: 50px;
    background-color: ${props => props.theme === 'white' ? '#fff' : '#000'};
    color: ${props => props.theme === 'white' ? '#000' : '#ccc'};
    outline-width: 3px;
    outline-style: solid;
    outline-color: ${props => props.theme === 'white' ? 'violet' : 'aqua'};
`
const NweetSend = styled.input`
    margin-left: -45px;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #0cf;
    outline-width: 3px;
    outline-offset: -1px; // 미세하게 보이는 경계면을 감추기 위함.
    outline-style: solid;
    outline-color: #0cf;
    color: ${props => props.theme === 'white' ? '#333' : '#fff'};
    font-size: 20px;
`
const NweetUploadImageLabel = styled.label`
    color: #08f;
`
const NweetUploadImageInput = styled.input`
    width: 1px;
    height: 1px;
    margin: -1px;
`
const NweetUploadImagePreview = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border: none;
`
const NweetUploadImageRmove = styled.button`
    background-color: transparent;
    color: #08f;    
    border: none;
`

export const NweetForm = () => {
    const [nweet, setNweet] = useState("");
    const [imageAttachment, setImageAttachment] = useState(undefined);
    const { userId } = useContext(LoginUserContext);
    const { theme } = useContext(ThemeContext);
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const imageUrl = `images/${uuid()}.jpg`;
            if (imageAttachment) {
                const storageRef = ref(fbStorage, imageUrl);
                uploadString(storageRef, imageAttachment, "data_url")
                    .then((result) => console.log({ state: "upload success", result }))
                    .catch((result) => console.log({ state: "upload failure", result }));
            }
            const data = {
                text: nweet,
                createdAt: new Date().toISOString(),
                creatorId: userId,
                imageUrl: imageAttachment ? imageUrl : "",
            };
            await addDoc(collection(fbDB, "nweets"), data)
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
        <Form onSubmit={onSubmit}>
            <NweetInputField>
                <NweetInput 
                    theme={theme}
                    type="text"
                    onChange={onChange}
                    value={nweet}
                    placeholder="What's on your mind?"
                    maxLength={120} 
                    required/><br />
                <NweetSend theme={theme} type="submit" value=">" />
            </NweetInputField>
            <NweetUploadImageLabel htmlFor="NweetForm_upload_image">Add Image</NweetUploadImageLabel>
            <NweetUploadImageInput type="file" accept="image/*" onChange={onFileChange} id="NweetForm_upload_image" /><br />
            {imageAttachment && (<>
                <NweetUploadImagePreview src={imageAttachment} /><br />
                <NweetUploadImageRmove onClick={onClearImage}>Remove</NweetUploadImageRmove><br />
            </>)}
        </Form>
    )
}