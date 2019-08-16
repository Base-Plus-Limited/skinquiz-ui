import React from 'react';
import styled from 'styled-components';
import { QuizQuestion } from '../Interfaces/QuizQuestion';

export interface QuestionProps {
  helper?: string;
  questions: QuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions, helper }: QuestionProps) => {
  return (
    <QuestionWrapper>
      <Question>
        {questions[0].question}
        {helper && <span> {helper} </span>}
      </Question>
      <Question>
        {questions[1].question}
        {helper && <span> {helper} </span>}
      </Question>
    </QuestionWrapper>
  )
}

const Question = styled.p`
  margin: 0;
  padding: 0;
`;

const QuestionWrapper = styled.div`
  display: grid;
  width: 100vw;
  text-align: center;
`;

export default StyledQuestion;