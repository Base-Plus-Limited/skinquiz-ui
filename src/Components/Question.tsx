import React, { useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import StyledAnswer from './Answer';
import { QuizContext } from '../QuizContext';

export interface QuestionProps {
  helper?: string;
  questions: IQuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions, helper }: QuestionProps) => {
  const [questionOne, questionTwo] = questions;

  const { quizQuestions, updateQuizQuestions } = useContext(QuizContext);


  const selectAnswer = (answeredQuestion: IQuizQuestion, answerId: string) => {
    const updatedQuestions = quizQuestions.map(question => {
      if(answeredQuestion.id === question.id) {
        question.answered = true;
        question.answers.forEach(answer => {
          answer.selected = false;
          if(answer.id === answerId)
            answer.selected = true;
        })
      }
      return question;
    });
    updateQuizQuestions(updatedQuestions);
  }


  return (
    <QuestionWrapper>
      <Question>
        {questionOne.question} <br/>
        {helper && <span> {helper} </span>}  <br/>
        {questionOne.answers.map((answer: IAnswer, id: number) => {
          return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionOne, answer.id)} key={id}>{answer.value}</StyledAnswer>
        })}
      </Question>
      <Question>
        {questionTwo.question} <br/>
        {helper && <span> {helper} </span>} <br/>
        {questionTwo.answers.map((answer: IAnswer, id: number) => {
          return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionTwo, answer.id)} key={id}>{answer.value}</StyledAnswer>
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