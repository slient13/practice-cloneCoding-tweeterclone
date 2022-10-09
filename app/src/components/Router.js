import React from "react";
import { HashRouter as Router/*, Switch*/, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// Switch는 react-router-dom@6.0.0 이후부터 제공되지 않음. 대신 Routes 이용.

import Authociation from "routes/Authociation";
import Home from "routes/Home";
import Profile from "routes/Profile";
import { Navigation } from "./Navigation";

const AppRouter = ({ isLoggedIn }) => {
    const target = {
        /* 
        react-router-dom@6.0.0 이전에는 다음과 같이 작성하였음.
        home: ( 
            <Route exact path="/">
                <Home />
            </Route> 
        )
        */
        home: { path: "/", element: (<Home isLoggedIn={isLoggedIn} />) },
        profile: { path: "/profile", element: (<Profile isLoggedIn={isLoggedIn} />) },
        loginPage: { path: "/auth", element: (<Authociation isLoggedIn={isLoggedIn} />) },
    };

    return (
        // 기본 구조는 Router { Routes { Route, ... }, ..., Route }
        <Router>
            {isLoggedIn && (<Navigation />)}
            <Routes>
                {Object.values(target).map((e) => <Route key={e.path} path={e.path} element={e.element} />)}
            </Routes>
        </Router >
    );
}

export default AppRouter;