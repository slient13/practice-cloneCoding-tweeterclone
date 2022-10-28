import { addSubscribe } from "db/NweetsDB";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { NweetBlock } from "./Contents/NweetBlock";

const BackPanel = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const Contents = () => {
    const [contents, setContents] = useState([]);
    useEffect(() => {
        const unsubscribe = addSubscribe((data) => setContents(data));
        return () => {
            unsubscribe();
        }
    }, [])
    return (
        <BackPanel>
            {contents?.map((e) => <NweetBlock key={e.id} docId={e.id} docData={e.data} />)}
        </BackPanel>
    )
}