import React, { useState, ChangeEvent, useContext } from 'react';
import styled from "styled-components";
import { StyledButton } from '../Components/Button';
import StyledInput from '../Components/Shared/Input';
import StyledH1 from '../Components/Shared/H1';
import StyledText from '../Components/Shared/Text';
import { Route } from 'react-router-dom';
import tubeImg from './../Assets/rotatedTube.png';
import { QuizContext } from '../QuizContext';

export interface WelcomeProps {
  
}

export interface WelcomeWrapperProps {
  maxWidth?: boolean;
}
 
const StyledWelcome: React.SFC<WelcomeProps> = () => {
  const { userName, updateUserName } = useContext(QuizContext);

  const logName = (event: ChangeEvent<HTMLInputElement>) => {
    updateUserName(event.target.value);
  };

  return ( 
    <Welcome>
      <WelcomeWrapper maxWidth>
        <StyledH1 text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH1>
        <StyledText text="Product description lorem ipsum dolor sit amet, cons ectetuer adipis cing elit, sed diam dolore magnat volutpat diam dolore."></StyledText>
        <StyledInput logInputValue={logName} placeholderText="Tell us your name :)" type="text"></StyledInput>
        <Route render={({ history }) => (
          <StyledButton onClickHandler={() => { history.push('/quiz'); }}>Start Quiz</StyledButton>
        )} />
      </WelcomeWrapper>
    </Welcome>
   );
}

const Welcome = styled.div`
  display: grid;
  background: url(${tubeImg}) no-repeat 430px -391px;
  grid-template-rows: 1fr;
  height: 88.5vh;
  align-items: center;
  padding: 0 20px;
  @media only screen and (min-width: 980px) {
    padding: 0;
  }
`;

const WelcomeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 auto;
  max-width: ${(props: WelcomeWrapperProps) => props.maxWidth ? '395px' : ''};
  @media only screen and (min-width: 980px) {
    padding: 0;
  }
`;

 
export default StyledWelcome;