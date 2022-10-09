import { fbAuth } from "fbInstance/fbAuth";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Profile = ({ isLoggedIn }) => {
    const onLogOutClicked = async (event) => {
        fbAuth.signOut();
    }
    const navigate = useNavigate();
    useEffect(() => {if (!isLoggedIn) navigate("/auth");});

    return <button onClick={onLogOutClicked}>Log Out</button>;
}
export default Profile;