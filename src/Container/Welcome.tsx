import React, { ChangeEvent, useContext, useEffect } from 'react';
import styled from "styled-components";
import { StyledButton } from '../Components/Button';
import StyledInput from '../Components/Shared/Input';
import StyledH1 from '../Components/Shared/H1';
import StyledText from '../Components/Shared/Text';
import { Route } from 'react-router-dom';
import welcomeImg from './../Assets/serum_and_moisturiser.jpg';
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
        if (res.ok) {
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
  }, []);


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
      :
      <Welcome> 
        <WelcomeWrapper maxWidth>
          <StyledH1 text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH1>
          <StyledText text="Create your own bespoke moisturiser and serum in 60 seconds"></StyledText>
          <StyledInput logInputValue={logName} placeholderText="Tell us your name or create your routine" type="text"></StyledInput>
          <Route render={({ history }) => (
            <StyledButton onClickHandler={() => {
              history.push('/quiz');
              logNameEvent();
            }}>Create your skincare routine</StyledButton>
          )} />
        </WelcomeWrapper>
      </Welcome>
  );
}

const Welcome = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 0 20px;
  grid-template-columns: 1fr;
  @media only screen and (min-width: 370px) {
    background: #fff no-repeat bottom center/90% url(${welcomeImg});
  }
  @media only screen and (min-width: 400px) {
    background: #fff no-repeat bottom center/90% url(${welcomeImg});
  }
  @media only screen and (min-width: 600px) {
    background: #fff no-repeat bottom center/90% url(${welcomeImg});
  }
  @media only screen and (min-width: 980px) {
    background: #fff no-repeat bottom center/70% url(${welcomeImg});
  }
  @media only screen and (min-width: 1280px) {
    background: #fff no-repeat bottom center/28% url(${welcomeImg});
  }
  @media only screen and (min-width: 1500px) {
    background: #fff no-repeat bottom center/50% url(${welcomeImg});
  }
  @media only screen and (min-width: 1800px) {
    background: #fff no-repeat bottom center/45% url(${welcomeImg});
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