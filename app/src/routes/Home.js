import { LoginUserContext } from "context/UserContext";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Contents } from "./Home/Contents"
import { NweetForm } from "./Home/NweetForm";

const BackPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(LoginUserContext)
    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn, navigate]);

    // console.log("Home: rendering");
    return (
        <>            
            {
                isLoggedIn &&
                (<BackPanel>
                    <NweetForm />
                    <Contents />
                </BackPanel>)
            }
        </>
    )
}
export default Home;
