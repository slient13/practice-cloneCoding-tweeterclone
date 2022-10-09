import { fbAuth } from "fbInstance/fbAuth";
import React, { useEffect, useState } from "react";
import {
    // create account
    createUserWithEmailAndPassword,
    // signIn methods
    signInWithEmailAndPassword,
    signInWithPopup,
    // providers
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Authociation = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    useEffect(() => { if (isLoggedIn) navigate("/") });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        let data;
        try {
            if (newAccount) {
                data = await createUserWithEmailAndPassword(fbAuth, email, password);
            } else {
                data = await signInWithEmailAndPassword(fbAuth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    }
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.AuthProvider
        if (name === 'login google') {
            provider = new GoogleAuthProvider()
        }
        else if (name === 'login github') {
            provider = new GithubAuthProvider()
        }
        // reference: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
        await signInWithPopup(fbAuth, provider).then((result) => {
        }, (error) => {
        });
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" onChange={onChange} required value={email} /><br />
                <input name="password" type="password" placeholder="Password" onChange={onChange} required value={password} /><br />
                <input type="Submit" value={newAccount ? "CreateCount" : "Log In"} /><br />
                {error ? error : ""}<br />
                <span onClick={() => {
                    setNewAccount(!newAccount);
                    setError("");
                }}>{newAccount ? "Go to login" : "Go to create account"}</span>
            </form>
            <div>
                <button name="login google" onClick={onSocialClick}>Continue with Google</button>
                <button name="login github" onClick={onSocialClick}>continue with Github</button>
            </div>
        </div>
    )
}
export default Authociation;