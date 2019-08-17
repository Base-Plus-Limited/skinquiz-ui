import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion } from '../Interfaces/QuizQuestion';
import StyledQuestion from '../Components/Question';
import { QuizContext } from '../QuizContext';


interface QuizProps {
  rows: number;
}

const StyledQuiz: React.FC<QuizProps> = () => {

  const { updateCount, quizQuestions, updateQuizQuestions } = useContext(QuizContext);

  useEffect(() => {
    fetch('/quiz')
      .then(res => res.json())
      .then((questions: IQuizQuestion[]) => updateQuizQuestions(questions))
      .catch(error => console.error(error));
  }, []);

  const formattedQuiz = (quizQuestions.map((q, i) => {
    if(i % 2 === 0)
      return quizQuestions.slice(i, i+2)
  }).filter(quizArr => quizArr !== undefined) as (IQuizQuestion[])[]);

  return ( 
    <Quiz rows={formattedQuiz.length}>
        {
          formattedQuiz.map((formattedQ, i) => <StyledQuestion questions={formattedQ} key={i}></StyledQuestion>)
        }
    </Quiz>
   );
}

const Quiz = styled.div`
  width: 100%;
  grid-template-columns: ${(props: QuizProps) => `repeat(${props.rows}, 100vw)`};
  overflow-x: scroll;
  display: grid;
`;
 
export default StyledQuiz;