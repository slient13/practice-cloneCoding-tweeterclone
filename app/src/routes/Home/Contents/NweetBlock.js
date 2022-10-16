import { fbDB } from "fbInstance/fbDB";
import fbStorage from "fbInstance/fbStorage";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useLayoutEffect, useRef, useState } from "react";
import { NweetChangeForm } from "./NweetBlock/NweetChangeForm";


export const NweetBlock = ({ userId, docId, docData, userProfileData }) => {
    const [isChangeMode, setIsChangeMode] = useState(false);
    const [imageDownloadUrl, setImageDownloadUrl] = useState(undefined);
    const prevImageUrl = useRef("");
    const datetime = new Date(docData.createdAt);
    const timeString = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`
    const style = {
        div: {
            border: 1 + "px solid black",
            backgroundColor: 333
        }, p: {
            marginTop: 5 + "px",
            marginBottom: 5 + "px",
        }
    }
    const loadImage = async () => {
        // console.log(`loadImage: ${docData.imageUrl}, ${imageDownloadUrl ? "downloadUrl is exist" : "There is no downloadUrl"}`);
        if (docData.imageUrl === "") imageDownloadUrl && setImageDownloadUrl(undefined);
        else if (prevImageUrl.current === docData.imageUrl) { }
        else getDownloadURL(ref(fbStorage, docData.imageUrl))
            .then((downloadUrl) => {
                // console.log(`image load finish ${docData.imageUrl}`);
                setImageDownloadUrl(downloadUrl);
            })
            .catch((reason) => {
                console.log(reason);
            })
        prevImageUrl.current = docData.imageUrl;
    }
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
    }, [docData.imageUrl])
    return (
        <>
            <div style={style.div}>
                <p style={style.p}>createdAt: {timeString}</p>
                <p style={style.p}>user: {userProfileData?.[docData.creatorId]?.displayName ?? docData.creatorId}</p>
                {isChangeMode && isOwner && <NweetChangeForm docId={docId} docData={docData} setIsChangeMode={setIsChangeMode} />}
                {!isChangeMode && <>
                    <p style={style.p}>{docData.text}</p>
                    {!(docData.imageUrl === "") && <><img src={imageDownloadUrl} width="100px" height="100px" /><br /></>}
                </>}
                {!isChangeMode && isOwner && (
                    <>
                        <button onClick={changeMode}>edit</button>
                        <button onClick={deleteNweet}>delete</button>
                    </>
                )}
            </div>
        </>
    )
}