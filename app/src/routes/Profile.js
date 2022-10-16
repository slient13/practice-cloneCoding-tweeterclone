import { fbAuth } from "fbInstance/fbAuth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyNweets } from "./Profile/MyNweets";
import { ProfileChange } from "./ProfileChange";

const Profile = ({ isLoggedIn, userObj, userProfileData }) => {
    const onLogOutClicked = async (event) => {
        fbAuth.signOut();
    }
    const navigate = useNavigate();
    useEffect(() => {if (!isLoggedIn) navigate("/auth");}, [isLoggedIn]);

    // console.log("Profile: rendering");
    const userId = userObj.uid
    const userName = userProfileData?.[userId]?.displayName ?? userId;
    return (
        <>
            <ProfileChange userId={userId} userName={userName} /><br/>
            <button onClick={onLogOutClicked}>Log Out</button><br/>
            <MyNweets userId={userObj.uid} userProfileData={userProfileData}/>
        </>
    )
}
export default Profile;