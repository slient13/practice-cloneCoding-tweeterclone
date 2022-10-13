import { async } from "@firebase/util";
import { fbDB } from "fbInstance/fbDB";
import { collection, CollectionReference, doc, getDocs, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NweetBlock } from "./NweetBlock";


export const Contents = ({ userId }) => {
    const [contents, setContents] = useState([]);
    useEffect(() => {
        onSnapshot(collection(fbDB, "nweets"), async (col) => {
            console.log("Contents: Contents Refresh");
            const queryData = await getDocs(query(collection(fbDB, "nweets"), orderBy("createdAt", "desc")));
            let output = [];
            queryData.forEach((doc) => {
                const [id, data] = [doc.id, doc.data()]
                output.push(<NweetBlock key={id} userId={userId} docId={id} docData={data} />)
            })
            setContents(output);
        });
    }, [])
    return (
        <>
            {contents}
        </>
    )
}