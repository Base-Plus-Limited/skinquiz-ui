import React, { useContext } from 'react';
import styled from 'styled-components';

import { QuizContext } from '../QuizContext';

export interface ProgressBarProps {
}

export interface SharedProgressBarProps {
}

const StyledProgressBar: React.FC<ProgressBarProps> = () => {

  const { questionsAnswered, quizQuestions } = useContext(QuizContext);

  const getProgressBarWidth = () => {
    const x = 100 / quizQuestions.length;
    return x * questionsAnswered.length;
  }

  return (
    <ProgressBar style={{width: getProgressBarWidth() + "%" }}>
    </ProgressBar>
  );
}

const ProgressBar = styled.div`
  transition: all ease 0.45s;
  background: ${props => props.theme.brandColours.baseDefaultGreen};
`

export default StyledProgressBar;