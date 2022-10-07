import React from "react";
import { useState } from "react";
import { HashRouter as Router/*, Switch*/, Routes, Route } from 'react-router-dom';
// Switch는 react-router-dom@6.0.0 이후부터 제공되지 않음. 대신 Routes 이용.

import Authociation from "../routes/Authociation";
import Home from "../routes/Home";

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 기본값은 false로

    const target = {
        /* 
        react-router-dom@6.0.0 이전에는 다음과 같이 작성하였음.
        home: ( 
            <Route exact path="/">
                <Home />
            </Route> 
        )
        */
        home: <Route path="/" element={<Home />} />,
        loginPage: <Route path="/" element={<Authociation />} />,
    };

    return (
        // 기본 구조는 Router { Routes { Route, ... }, ..., Route }
        <Router>
            <Routes>
                {isLoggedIn ? target.home : target.loginPage}
            </Routes>
        </Router>
    );
}

export default AppRouter;