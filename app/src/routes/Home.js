import { fbDB } from "fbInstance/fbDB";
import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contents } from "./Contents";
import { NweetForm } from "./NweetForm";

const Home = ({ isLoggedIn, userObj }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn]);

    return (
        <>
            {
                isLoggedIn &&
                (<>
                    <NweetForm userId={userObj.uid} />
                    <Contents userId={userObj.uid} />
                </>)
            }
        </>
    )
}
export default Home;
