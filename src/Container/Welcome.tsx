import * as React from 'react';
import styled from "styled-components";
import StyledButton from '../Components/Button';

export interface WelcomeProps {
  
}
 
const StyledWelcome: React.SFC<WelcomeProps> = () => {
  return ( 
    <Welcome>
      <WelcomeWrapper>
        <h1>sasasasa</h1>
        <p>sasasasa</p>
        <StyledButton value="Start Quiz"></StyledButton>
      </WelcomeWrapper>
      <WelcomeWrapper></WelcomeWrapper>
    </Welcome>
   );
}

const Welcome = styled.div`

`;

const WelcomeWrapper = styled.div`
  width: 50%;
  text-align: center;
`;

 
export default StyledWelcome;