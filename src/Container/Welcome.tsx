import React, { ChangeEvent, useContext, useEffect } from 'react';
import styled from "styled-components";
import { StyledButton } from '../Components/Button';
import StyledInput from '../Components/Shared/Input';
import StyledH1 from '../Components/Shared/H1';
import StyledText from '../Components/Shared/Text';
import { QuizContext } from '../QuizContext';
import { track, generateAnalyticsId, generateLongUniqueId } from './../Components/Shared/Analytics';

export interface WelcomeProps {
}

export interface WelcomeWrapperProps {
  maxWidth?: boolean;
}

const StyledWelcome: React.SFC<WelcomeProps> = () => {
  const { saveLongUniqueId, toggleQuizVisibility, userName, updateUserName, saveAnalyticsId, analyticsId } = useContext(QuizContext);

  useEffect(() => {
    saveLongUniqueId(generateLongUniqueId())
  }, [])

  const logQuizStarted = () => {
    const id = generateAnalyticsId(12);
    track({
      distinct_id: id,
      event_type: "Quiz started"
    });
    saveAnalyticsId(id);
  }

  const logName = (event: ChangeEvent<HTMLInputElement>) => {
    updateUserName(event.target.value);
  };

  const logNameEvent = () => {
    if (userName.trim().length > 0)
      track({
        distinct_id: analyticsId,
        event_type: "Name entered"
      });
    logQuizStarted();
    toggleQuizVisibility(true);
  };

  return (
    <Welcome> 
      <WelcomeWrapper maxWidth>
        <StyledH1 text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH1>
        <StyledText text="Create your own bespoke moisturiser and serum in 60 seconds"></StyledText>
        <StyledInput logInputValue={logName} placeholderText="Tell us your name or create your routine" type="text"></StyledInput>
        <StyledButton onClickHandler={() => {
          logNameEvent();
        }}>Create your skincare routine</StyledButton>
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
  grid-row: 2/span 3;
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