import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Contents } from "./Home/Contents"
import { NweetForm } from "./Home/NweetForm";

const Home = ({ isLoggedIn, userObj, userProfileData }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn]);

    // console.log("Home: rendering");
    return (
        <>            
            {
                isLoggedIn &&
                (<>
                    <NweetForm userId={userObj.uid} />
                    <Contents userId={userObj.uid} userProfileData={userProfileData}/>
                </>)
            }
        </>
    )
}
export default Home;
