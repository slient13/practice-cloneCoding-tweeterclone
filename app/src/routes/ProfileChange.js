import { fbDB } from "fbInstance/fbDB";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react"

export const ProfileChange = ({ userId, userName }) => {
    const [changeMode, setChangeMode] = useState(false);
    const [newName, setNewName] = useState(userName);
    useEffect(() => {
        setNewName(userName);
    }, [userId, userName])
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewName(value);
    }
    const onChangeClick = (event) => {
        setChangeMode(true);
    }
    const onCancelClick = (event) => {
        setNewName(userName);
        setChangeMode(false);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        setDoc(doc(fbDB, "userData", userId), {
            displayName: newName
        });
        setChangeMode(false);
    }
    return (
        <>{
            !changeMode
                ? <button onClick={onChangeClick}>닉네임 변경</button>
                : <form onSubmit={onSubmit}>
                    <input type="text" value={newName} onChange={onChange} />
                    <input type="submit" value="변경" />
                    <input type="button" onClick={onCancelClick} value="취소" />
                </form>
        }</>
    )
}