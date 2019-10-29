import React, { useState, ChangeEvent, useContext } from 'react';
import styled from "styled-components";
import { StyledButton } from '../Components/Button';
import StyledInput from '../Components/Shared/Input';
import StyledH1 from '../Components/Shared/H1';
import StyledText from '../Components/Shared/Text';
import StyledImage from '../Components/Shared/Image';
import { Link } from 'react-router-dom';
import welcomeImg from './../Assets/wlecomeScreenImg.jpg';
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
        <Link to={{ pathname: '/quiz' }}> 
          <StyledButton>Start Quiz</StyledButton>
        </Link>
      </WelcomeWrapper>
      <WelcomeWrapper>
        <StyledImage isWelcomeScreen alt="Welcome to base+" src={welcomeImg}></StyledImage>
      </WelcomeWrapper>
    </Welcome>
   );
}

const Welcome = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 0 20px;
  @media only screen and (min-width: 980px) {
    padding: 0;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WelcomeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 auto;
  max-width: ${(props: WelcomeWrapperProps) => props.maxWidth ? '395px' : ''};
  img{
    display: none;
  }
  @media only screen and (min-width: 980px) {
    padding: 0;
    grid-template-columns: repeat(2, 1fr);
    img{
      display: block;
    }
  }
`;

 
export default StyledWelcome;