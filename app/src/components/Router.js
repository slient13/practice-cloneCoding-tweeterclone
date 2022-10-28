import { LoginUserContext, UserDBContext } from "context/UserContext";
import React, { useContext } from "react";
import { HashRouter as Router/*, Switch*/, Routes, Route, } from 'react-router-dom';
// Switch는 react-router-dom@6.0.0 이후부터 제공되지 않음. 대신 Routes 이용.

import Authociation from "routes/Authociation";
import Home from "routes/Home";
import Profile from "routes/Profile";
import styled, { ThemeContext } from "styled-components";
import { Navigation } from "./Navigation";

const LoginUserNamePanel = styled.div`
    text-align: right;    
    margin-bottom: 50px;    
`
const UserNameSpan = styled.span`
    border-radius: 10px;
    background-color: ${props => props.theme === 'white' ? '#ddd' : '#333'};
    padding: 2px 5px;
`

const AppRouter = () => {
    const { isLoggedIn, userId } = useContext(LoginUserContext);
    const { userDB } = useContext(UserDBContext);
    const { theme } = useContext(ThemeContext);
    const target = {
        /* 
        react-router-dom@6.0.0 이전에는 다음과 같이 작성하였음.
        home: ( 
            <Route exact path="/">
                <Home />
            </Route> 
        )
        */
        home: { path: "/", element: (<Home />) },
        profile: { path: "/profile", element: (<Profile />) },
        loginPage: { path: "/auth", element: (<Authociation />) },
    };
    const userName = userDB[userId]?.displayName ?? userId;
    // 기본 구조는 Router {Routes {Route, ... }, ..., Route }
    return (
        <Router>
            {isLoggedIn && (<>
                <Navigation />
                <LoginUserNamePanel><UserNameSpan theme={theme}>user: {userName}</UserNameSpan></LoginUserNamePanel>
            </>)}
            <Routes>
                {Object.values(target).map((e) =>
                    <Route key={e.path} path={e.path} element={e.element} />)}
            </Routes>
        </Router >
    );
}

export default AppRouter;