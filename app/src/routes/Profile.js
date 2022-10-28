import { LoginUserContext } from "context/UserContext";
import { fbAuth } from "fbInstance/fbAuth";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { MyNweets } from "./Profile/MyNweets";
import { ProfileChange } from "./ProfileChange";

const BackPanel = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Button = styled.button`
    width: 40%;
    height: 30px;
    border-radius: 15px;
    border: none;
    ${props => props.theme === 'white' && "box-shadow: 5px 5px 5px #333"};
`
const ChangeNameButton = styled(Button)`
    background-color: #88f;
`
const LogoutButton = styled(Button)`
    background-color: #f88;
`

const Profile = () => {
    const [changeMode, setChangeMode] = useState(false);
    const onLogOutClicked = async (event) => {
        fbAuth.signOut();
    }
    const { isLoggedIn } = useContext(LoginUserContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn, navigate]);
    // console.log({ isLoggedIn, userObj });
    // console.log("Profile: rendering");
    const onChangeClick = (event) => {
        setChangeMode(true);
    }
    return (
        <BackPanel>
            {isLoggedIn && (<>
                {!changeMode
                    ? <ChangeNameButton theme={theme} onClick={onChangeClick}>닉네임 변경</ChangeNameButton>
                    : <ProfileChange setChangeMode={setChangeMode} />}<br />
                <LogoutButton theme={theme} onClick={onLogOutClicked}>Log Out</LogoutButton><br />
                <MyNweets />
            </>)}
        </BackPanel>
    )
}
export default Profile;