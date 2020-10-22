import React, { ChangeEvent, useContext, useEffect } from 'react';
import styled from "styled-components";
import { StyledButton } from '../Components/Button';
import StyledInput from '../Components/Shared/Input';
import StyledH1 from '../Components/Shared/H1';
import StyledText from '../Components/Shared/Text';
import { Route } from 'react-router-dom';
import tubeImg from './../Assets/rotatedTube.png';
import { QuizContext } from '../QuizContext';
import StyledErrorScreen from '../Components/Shared/ErrorScreen';
import { track, generateUniqueId } from './../Components/Shared/Analytics';

export interface WelcomeProps {
}

export interface WelcomeWrapperProps {
  maxWidth?: boolean;
}

const StyledWelcome: React.SFC<WelcomeProps> = (history) => {
  const { userName, updateUserName, setApplicationError, hasApplicationErrored, saveUniqueId, uniqueId } = useContext(QuizContext);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => {
        if(res.ok) {
          logQuizStarted();
          return res.json();
        }
        res.json().then(errorResponse => setApplicationError(errorResponse))
      })
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

    fetch('/api/ingredients')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });
  }, [setApplicationError]);


  const logQuizStarted = () => {
    const id = generateUniqueId();
    track({
      distinct_id: id,
      event_type: "Quiz started"
    });
    saveUniqueId(id);
  }

  const logName = (event: ChangeEvent<HTMLInputElement>) => {
    updateUserName(event.target.value);
  };

  const logNameEvent = () => {
    if (userName.trim().length > 0)
      track({
        distinct_id: uniqueId,
        event_type: "Name entered"
      });
  };

  return (
    hasApplicationErrored.error ?
      <StyledErrorScreen message="We're unable to load the quiz at the moment, please try again later"></StyledErrorScreen>
      : <Welcome>
        <WelcomeWrapper maxWidth>
          <StyledH1 text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH1>
          <StyledText text="Use our product builder to create your own bespoke moisturiser in 60 seconds"></StyledText>
          <StyledInput logInputValue={logName} placeholderText="Tell us your name or press start" type="text"></StyledInput>
          <Route render={({ history }) => (
            <StyledButton onClickHandler={() => {
              history.push('/quiz');
              logNameEvent();
            }}>Start</StyledButton>
          )} />
        </WelcomeWrapper>
      </Welcome>
  );
}

const Welcome = styled.div`
  display: grid;
  background: url(${tubeImg}) no-repeat 430px -391px;
  grid-template-rows: 1fr;
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