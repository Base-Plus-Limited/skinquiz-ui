import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion } from '../Interfaces/QuizQuestion';
import StyledQuestion from '../Components/Question';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';


interface QuizProps {
  rows: number;
  marginValue: number;
}

const StyledQuiz: React.FC<QuizProps> = () => {

  const { quizQuestions, updateQuizQuestions, updateIngredients, questionsAnswered, updateCount } = useContext(QuizContext);

  useEffect(() => {
    fetch('/quiz')
      .then(res => res.json())
      .then((questions: IQuizQuestion[]) => updateQuizQuestions(questions))
      .catch(error => console.error(error));

    fetch('/ingredients')
      .then(res => res.json())
      .then((ingredients: IIngredient[]) => updateIngredients(ingredients))
      .catch(error => console.error(error));
  }, []);

  const formattedQuiz = (quizQuestions.map((q, i) => {
    if (i % 2 === 0)
      return quizQuestions.slice(i, i + 2)
  }).filter(quizArr => quizArr !== undefined) as (IQuizQuestion[])[]);

  const returnMarginAmount = () => {
    switch (questionsAnswered.length) {
      case 2:
      case 3:
        return 1;
      case 4:
      case 5:
        return 2;
      case 6:
      case 7:
        return 3;
      case 8:
        return 4;
      default:
        return 0;
    }
  }

  updateCount(returnMarginAmount() + 1)

  return ( 
    <ScrollWrapper>
      <Quiz rows={formattedQuiz.length} marginValue={returnMarginAmount()}>
        {
          formattedQuiz.map((formattedQ, index) => <StyledQuestion questions={formattedQ} key={index}></StyledQuestion>)
        }
      </Quiz>
    </ScrollWrapper>
   );
}

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const Quiz = styled.div`
  width: 100%;
  transition: all 1s ease-out;
  grid-template-columns: ${(props: QuizProps) => `repeat(${props.rows}, 100vw)`};
  display: grid;
  height: 100%;
  margin-left: ${(props: QuizProps) => `-${props.marginValue}00vw`}
`;
 
export default StyledQuiz;