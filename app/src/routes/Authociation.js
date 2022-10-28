import { fbAuth } from "fbInstance/fbAuth";
import React, { useContext, useEffect, useState } from "react";
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
import { LoginUserContext } from "context/UserContext";
import styled, { ThemeContext } from "styled-components";

const BackBoard = styled.div`
    width: 350px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`

const Form = styled.form`
    justify-content: center;
    text-align: center;
`
const Input = styled.input`
    width: 310px;
    height: 30px;
    border-radius: 15px;
    padding: 3px 6px;
    margin: 5px 0px;
    ${props => props.theme === 'white' && "box-shadow: 5px 5px 5px #888"};
`
const SubmitInput = styled(Input)`
    width: 326px;
    height: 36px;
    background-color: #0af;
    color: white;
    ${props => props.theme === 'white' && "box-shadow: 5px 5px 5px #888"};
`
const ErrorText = styled.div`
    color: #e33;
    text-align: center;
    padding: 0;
`
const ChangeModePanel = styled.div`
    margin-top: 10px;
`
const ChangeModeText = styled.span`
    padding: 0px 3px;
    outline: 1px solid black;
`
const SocialLoginBackboard = styled.div`
    justify-content: center;
    display: flex;
`
const SocialLoginButton = styled.button`
    margin: 0px 15px;
    height: 30px;
    border-radius: 15px;
    ${props => props.theme === 'white' && "box-shadow: 5px 5px 5px #888"};
`

const Authociation = () => {
    const { isLoggedIn } = useContext(LoginUserContext);
    const { theme } = useContext(ThemeContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => { if (isLoggedIn) navigate("/") }, [isLoggedIn, navigate]);
    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (newAccount) {
                await createUserWithEmailAndPassword(fbAuth, email, password);
            } else {
                await signInWithEmailAndPassword(fbAuth, email, password);
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
        <BackBoard>
            <Form onSubmit={onSubmit}>
                <Input theme={theme} name="email" type="text" placeholder="Email" onChange={onChange} required value={email} /><br />
                <Input theme={theme} name="password" type="password" placeholder="Password" onChange={onChange} required value={password} /><br />
                <SubmitInput theme={theme} type="Submit" value={newAccount ? "CreateCount" : "Log In"} /><br />
                <ErrorText>{error ? error : ""}</ErrorText>
                <ChangeModePanel><ChangeModeText onClick={() => {
                    setNewAccount(!newAccount);
                    setError("");
                }}>{newAccount ? "Go to login" : "Go to create account"}</ChangeModeText></ChangeModePanel>
            </Form>
            <br />
            <SocialLoginBackboard>
                <SocialLoginButton theme={theme} name="login google" onClick={onSocialClick}>Continue with Google</SocialLoginButton>
                <SocialLoginButton theme={theme} name="login github" onClick={onSocialClick}>continue with Github</SocialLoginButton>
            </SocialLoginBackboard>
        </BackBoard>
    )
}
export default Authociation;