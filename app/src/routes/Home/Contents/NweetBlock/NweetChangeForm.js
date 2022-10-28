import { useRef, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { deleteObject, ref, uploadString } from "firebase/storage";
import fbStorage from "fbInstance/fbStorage";
import styled from "styled-components";

const { fbDB } = require("fbInstance/fbDB");
const { setDoc, doc } = require("firebase/firestore");

const BackPanel = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`
const NweetUploadImageLabel = styled.label`
    color: #008;
`
const NweetUploadImageInput = styled.input`
    width: 1px;
    height: 1px;
    margin: -1px;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
const ShortForm = styled(Form)`
    width: 70%;
`
const NweetTextInput = styled.input`
    width: 100%;
    height: auto;
    border-radius: 10px;
`
const ButtonCommonCSS = `
    width: 100%;    
    height: 30px;
    border-radius: 10px;
    margin-bottom: 10px;  
`
const RemoveImageButton = styled.button`
    ${ButtonCommonCSS}  
    background-color: #ff0;
`
const SubmitButton = styled.input`
    ${ButtonCommonCSS}
    background-color: #88f;
`
const CancelButton = styled.button`
    ${ButtonCommonCSS}
    background-color: #f88;
    margin-bottom: 0px;  
`
const Image = styled.img`
    width: 100px;
    height: 100px;
    outline: 3px solid black;
    border-radius: 50px;
    position: absolute;
    right: 0px;
    bottom: 0px;
`
export const NweetChangeForm = ({ docId, docData, image, setIsChangeMode }) => {
    const [text, setText] = useState(docData.text);    
    const [imageAttachment, setImageAttachment] = useState(image);
    const initImage = useRef(docData.imageUrl);
    const onSubmit = async (event) => {
        event.preventDefault();
        let data = {
            ...docData,
            text: text,
        };
        if (initImage.current === imageAttachment) {}
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
    }
    const onDeleteImage = (event) => {
        event.preventDefault();
        setImageAttachment(undefined);
    }
    const onCancel = (event) => {
        event.preventDefault();
        setIsChangeMode(false)
    }
    const TargetForm = !imageAttachment ? Form : ShortForm;
    return (
        <BackPanel>
            <TargetForm onSubmit={onSubmit}>
                <NweetTextInput
                    name="text" type="text" placeholder="Write new contents" defaultValue={text}
                    onChange={onChange}
                    maxLength={120} 
                    required />
                <NweetUploadImageLabel htmlFor="NweetChangeForm">
                    {imageAttachment ? "Edit Image" : "Select Image"}
                </NweetUploadImageLabel>
                <NweetUploadImageInput type="file" id="NweetChangeForm" onChange={onFileChange} /><br/>
                {imageAttachment && <RemoveImageButton onClick={onDeleteImage}>remove image</RemoveImageButton>}
                <SubmitButton type="submit" value="save" />
                <CancelButton onClick={onCancel}>cancel</CancelButton>
            </TargetForm>
            {imageAttachment && <Image src={imageAttachment}/>}
        </BackPanel>
    )    
}