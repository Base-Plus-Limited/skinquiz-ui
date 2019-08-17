import React from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import Answer from './Answer';

export interface QuestionProps {
  helper?: string;
  questions: IQuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions, helper }: QuestionProps) => {
  const [questionOne, questionTwo ] = questions;
  return (
    <QuestionWrapper>
      <Question>
        {questionOne.question} <br/>
        {helper && <span> {helper} </span>}  <br/>
        {questionOne.answers.map((answer: IAnswer, id: number) => {
          return <Answer key={id}>{answer.value}</Answer>
        })}
      </Question>
      <Question>
        {questionTwo.question} <br/>
        {helper && <span> {helper} </span>} <br/>
        {questionTwo.answers.map((answer: IAnswer, id: number) => {
          return <Answer key={id}>{answer.value}</Answer>
        })}
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
  align-items: center;
  text-align: center;
`;

export default StyledQuestion;