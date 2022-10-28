import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
    display: flex;    
    justify-content: center;
    margin-bottom: 10px;
`
const Panel = styled.div`
    display: flex;    
`
const ItemPanel = styled.div`
    width: 100px;
    height: 20px;    
    text-align: center;
`
const StyledLink = styled(Link)`
    -webkit-tap-highlight-color: transparent; // 클릭 시 생기는 파란색 음영을 투명하게 만듬.
`
// const IconImage = styled.img`
//     width: 70px;
//     height: 70px;
//     margin: 15px;
// `

export const Navigation = ({ isLoggedIn }) => {
    return (
        <Nav>
            <Panel>
                <ItemPanel>
                    <StyledLink to='/'>
                        {/* <IconImage /> */}
                        Home
                    </StyledLink>
                </ItemPanel>
                <ItemPanel>
                    <StyledLink to='/profile' >
                        {/* <IconImage /> */}
                        My Profile
                    </StyledLink>
                </ItemPanel>
            </Panel>
        </Nav>
    )
}