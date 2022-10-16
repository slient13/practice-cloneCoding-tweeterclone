import { fbDB } from "fbInstance/fbDB";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useId, useState } from "react"
import { NweetBlock } from "routes/Home/Contents/NweetBlock";

export const MyNweets = ({ userId, userProfileData }) => {
    const [myNweets, setMyNweets] = useState([]);
    useEffect(() => {
        const onSnapshotRef = onSnapshot(collection(fbDB, "nweets"), async () => {
            console.log("MyNweets data loaded.");
            const queryData = query(
                collection(fbDB, "nweets"),
                where("creatorId", "==", "" + userId),
                orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(queryData);
            let output = [];
            querySnapshot.forEach((doc) => {
                output.push({ id: doc.id, data: doc.data() });
            })
            setMyNweets(output);
        })
        return () => {
            onSnapshotRef();
        }
    }, [useId])

    return (
        <>
            {myNweets.map((e) => <NweetBlock
                key={e.id}
                userId={userId}
                docId={e.id}
                docData={e.data}
                userProfileData={userProfileData} />
            )}
        </>
    )
}