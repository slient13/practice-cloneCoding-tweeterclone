import { LoginUserContext } from "context/UserContext";
import { addSubscribe } from "db/NweetsDB";
import { useContext, useEffect, useState } from "react"
import { NweetBlock } from "routes/Home/Contents/NweetBlock";
import styled from "styled-components";

const BackPanel = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const MyNweets = () => {
    const [myNweets, setMyNweets] = useState([]);
    const { userId, userProfileData } = useContext(LoginUserContext);
    useEffect(() => {
        const onSnapshotRef = addSubscribe((docData) => {
            setMyNweets(docData.filter(v => v.data.creatorId === userId))
        });
        return () => {
            onSnapshotRef();
        }
    }, [userId])

    return (
        <BackPanel>
            {myNweets.map((e) => <NweetBlock
                key={e.id}
                userId={userId}
                docId={e.id}
                docData={e.data}
                userProfileData={userProfileData} />
            )}
        </BackPanel>
    )
}