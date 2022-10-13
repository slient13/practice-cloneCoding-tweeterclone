import { async } from "@firebase/util";
import { fbDB } from "fbInstance/fbDB";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NweetChangeForm } from "./NweetBlock/NweetChangeForm";


export const NweetBlock = ({ userId, docId, docData }) => {
    const [isChangeMode, setIsChangeMode] = useState(false);
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
    const deleteNweet = async (event) => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(doc(fbDB, "nweets", docId));
        }
    }
    const changeMode = () => {
        setIsChangeMode(!isChangeMode);
    }
    const isOwner = (userId === docData.creatorId);
    return (
        <>
            <div style={style.div}>
                <p style={style.p}>create: {timeString}</p>
                <p style={style.p}>user: {docData.creatorId}</p>
                {isChangeMode && isOwner && <NweetChangeForm docId={docId} docData={docData} setIsChangeMode={setIsChangeMode} />}
                {!isChangeMode && <p style={style.p}>{docData.text}</p>}
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