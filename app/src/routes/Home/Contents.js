import { fbDB } from "fbInstance/fbDB";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NweetBlock } from "./Contents/NweetBlock";


export const Contents = ({ userId, userProfileData }) => {
    const [contents, setContents] = useState([]);
    useEffect(() => {
        const onSnapshotRef = onSnapshot(collection(fbDB, "nweets"), async (col) => {
            console.log("Contents: Contents Refresh");
            const queryData = await getDocs(query(collection(fbDB, "nweets"), orderBy("createdAt", "desc")));
            let output = [];
            queryData.forEach((doc) => {
                const [id, data] = [doc.id, doc.data()]
                output.push({ id, data })
            })
            setContents(output);
        });
        return () => {
            onSnapshotRef();
        }
    }, [])
    return (
        <>
            {contents.map((e) => <NweetBlock key={e.id} userId={userId} docId={e.id} docData={e.data} userProfileData={userProfileData} />)}
        </>
    )
}