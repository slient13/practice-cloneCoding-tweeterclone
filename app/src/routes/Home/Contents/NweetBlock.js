import { ThemeContext } from "styled-components";
import { LoginUserContext, UserDBContext } from "context/UserContext";
import { fbDB } from "fbInstance/fbDB";
import fbStorage from "fbInstance/fbStorage";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useCallback, useContext, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NweetChangeForm } from "./NweetBlock/NweetChangeForm"

const BackPanel = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 70%;
    border: none;
    background-color: ${props => props.theme === 'white' ? '#fff' : '#eee'};
    color: #000;
    padding: 20px;
    margin: 15px 0px;
    border-radius: 10px;
    ${props => props.theme === 'white' && "box-shadow: 5px 5px 15px #888"};    
`

const UserName = styled.h3`
    margin-top: -10px;
    margin-bottom: 5px;
`
const CreateTime = styled.p`
    font-size: 10px;
    margin: 0px;
    margin-bottom: 20px;
`
const NweetText = styled.p`
    margin-top: 5px;
    margin-bottom: 0px;
    overflow-wrap: break-word;
    background-color: ${props => props.theme === 'white' ? '#eee' : '#ddd'};
    border-radius: 10px;
    padding: 10px;
`
const NweetTextShort = styled(NweetText)`
    width: 70%;
`
const Image = styled.img`
    width: 100px;
    height: 100px;
    outline-width: 3px;
    outline-style: solid;
    outline-color: ${props => props.theme === 'white' ? '#ccc' : '#000'};
    border-radius: 50px;
    position: absolute;
    right: 10px;
    bottom: -10px;
`
const ButtonPanel = styled.div`
    display: flex;
    position: absolute;
    top: 15px;
    right: 15px;
`
const Button = styled.button`
`

export const NweetBlock = ({ docId, docData }) => {
    const [isChangeMode, setIsChangeMode] = useState(false);
    const [imageDownloadUrl, setImageDownloadUrl] = useState(undefined);
    const prevImageUrl = useRef("");
    const { userId } = useContext(LoginUserContext);
    const { userDB } = useContext(UserDBContext);
    const { theme } = useContext(ThemeContext);
    const datetime = new Date(docData.createdAt);
    const timeString = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`
    const loadImage = useCallback(async () => {
        // console.log(`loadImage: ${docData.imageUrl}, ${imageDownloadUrl ? "downloadUrl is exist" : "There is no downloadUrl"}`);
        const setDownloadURL = () => getDownloadURL(ref(fbStorage, docData.imageUrl))
            .then((downloadUrl) => {
                // console.log(`image load finish ${docData.imageUrl}`);
                setImageDownloadUrl(downloadUrl);
            }).catch((reason) => {
                console.log(reason);
                setTimeout(() => {
                    setDownloadURL();
                }, 500);
            })
        if (docData.imageUrl === "") imageDownloadUrl && setImageDownloadUrl(undefined);
        else if (prevImageUrl.current === docData.imageUrl) { }
        else setDownloadURL();
        prevImageUrl.current = docData.imageUrl;
    }, [docData.imageUrl])
    const deleteNweet = async (event) => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(doc(fbDB, "nweets", docId));
            !(docData.imageUrl === "") && await deleteObject(ref(fbStorage, docData.imageUrl));
        }
    }
    const changeMode = () => {
        setIsChangeMode(!isChangeMode);
    }
    const isOwner = (userId === docData.creatorId);
    // console.log(`NweetBlock: rendering with ${docId}`);
    useLayoutEffect(() => {
        loadImage();
    }, [docData.imageUrl, loadImage])
    return (
        <BackPanel theme={theme}>
            <UserName>{userDB?.[docData.creatorId]?.displayName ?? docData.creatorId}</UserName>
            <CreateTime>{timeString}</CreateTime>
            {isChangeMode && isOwner &&
                <NweetChangeForm docId={docId} docData={docData} image={imageDownloadUrl} setIsChangeMode={setIsChangeMode} />}
            {!isChangeMode && (
                (docData.imageUrl === "")
                    ? <NweetText theme={theme}>{docData.text}</NweetText>
                    : <>
                        <NweetTextShort>{docData.text}</NweetTextShort>
                        <Image theme={theme} src={imageDownloadUrl} width="100px" height="100px" />
                    </>
            )}
            {!isChangeMode && isOwner && (
                <ButtonPanel>
                    <Button onClick={changeMode}>&#x1F4DD;</Button>
                    <Button onClick={deleteNweet}>&#x274C;</Button>
                </ButtonPanel>
            )}
        </BackPanel>
    )
}