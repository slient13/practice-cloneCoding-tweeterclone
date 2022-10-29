import { LoginUserContext, UserDBContext } from "context/UserContext";
import { useContext, useEffect, useState } from "react"
import styled, { ThemeContext } from "styled-components";
import { setUserProfile } from "util/userDB";

const Form = styled.form`
    width: 100%;
    display: flex;
    justify-content: center;
`
const Input = styled.input`
    width: 60%;
    height: 30px;
    border-radius: 15px;
    border: none;
    ${props => props.theme === 'white' 
        ? "box-shadow: 5px 5px 5px #333" 
        : "outline: 3px solid #8f8"};    
    background-color: ${props => props.theme === 'white' ? '#fff' : '#000'};
    color: ${props => props.theme === 'white' ? '#000' : '#ccc'};
    padding: 0 15px;
    margin-right: -120px;
`
const Button = styled.input`
    border-radius: 15px;
    border: none;
`
const SubmitButton = styled(Button)`
    width: 60px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: #88f;
    `
const CancelButton = styled(Button)`
    width: 60px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    background-color: #f88;
`

export const ProfileChange = ({ setChangeMode }) => {
    const { userId } = useContext(LoginUserContext);
    const { userDB } = useContext(UserDBContext);
    const { theme } = useContext(ThemeContext);
    const userName = userDB?.[userId]?.displayName ?? userId;
    const [newName, setNewName] = useState(userName);
    useEffect(() => {
        setNewName(userName);
    }, [userId, userName])
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewName(value);
    }
    const onCancelClick = (event) => {
        setNewName(userName);
        setChangeMode(false);
    }
    const onSubmit = (event) => {
        event.preventDefault();
        setUserProfile(userId, newName);
        setChangeMode(false);
    }
    return (
        <Form onSubmit={onSubmit}>
            <Input theme={theme} type="text" value={newName} onChange={onChange} maxLength='20'/>
            <SubmitButton type="submit" value="변경" />
            <CancelButton type="button" onClick={onCancelClick} value="취소" />
        </Form>
    )
}