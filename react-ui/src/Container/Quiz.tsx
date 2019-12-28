import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion } from '../Interfaces/QuizQuestion';
import StyledQuestion from '../Components/Question';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';
import StyledSummary from '../Components/Summary';
import StyledFooter from '../Components/Footer';
import LoadingAnimation from '../Components/Shared/LoadingAnimation';
import StyledErrorScreen from '../Components/Shared/ErrorScreen';
import { IErrorResponse } from '../Interfaces/ErrorResponse';


interface QuizProps {
  rows: number;
  marginValue: number;
}

const StyledQuiz: React.FC<QuizProps> = () => {

  const { quizQuestions, updateQuizQuestions, updateIngredients, questionsAnswered, updateCount, saveBaseIngredient, setApplicationError, hasApplicationErrored } = useContext(QuizContext);

  useEffect(() => {
    // const abortController = new AbortController();
    // const signal = abortController.signal;
    fetch('/api/questions')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .then((questions: IQuizQuestion[]) => updateQuizQuestions(questions))
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

    fetch('/api/ingredients')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .then((ingredients: IIngredient[]) => {
        const filteredIngredients = ingredients.filter(ingredient => ingredient.id !== 1474);
        const baseIngredient = (ingredients.find(ingredient => ingredient.id === 1474) as IIngredient);
        saveBaseIngredient(baseIngredient);
        updateIngredients(filteredIngredients);
      })
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

      // return function cleanup() {
      //   abortController.abort();
      // }
  }, []);

  const formattedQuiz = () => {
    const skinConditionQuestion = quizQuestions.filter(question => question.id === 1443);
    const y = quizQuestions.filter(question => question.id !== 1443);
    const x = y.map((q, i) => {
      if (i % 2 === 0)
        return y.slice(i, i + 2);
    }).filter(quizArr => quizArr !== undefined) as (IQuizQuestion[])[]
    x.splice(2, 0, skinConditionQuestion);
    return x;
  };

  const returnMarginAmount = () => {
    switch (questionsAnswered.length) {
      case 2:
      case 3:
        return 1;
      case 4:
        return 2;
      case 5:
      case 6:
        return 3;
      case 7:
        return 4;
      case 8:
        return 5;
      default:
        return 0;
    }
  }

  const getErrorMessage = (error: IErrorResponse) => {
    return `${hasApplicationErrored.uiMessage && hasApplicationErrored.uiMessage.length > 0 ? `${hasApplicationErrored.uiMessage}` : "We're unable to load the quiz at the moment, please try again later"}`
  }

  updateCount(questionsAnswered.length)

  return ( 
    hasApplicationErrored.error ? 
      <StyledErrorScreen message={getErrorMessage(hasApplicationErrored)}></StyledErrorScreen>
    : <React.Fragment>
      <ScrollWrapper>
        <Quiz rows={formattedQuiz().length + 1} marginValue={returnMarginAmount()}>
          {
            formattedQuiz()[0].length ?
            formattedQuiz().map((formattedQ, index) => <StyledQuestion questions={formattedQ} key={index}></StyledQuestion>) :
            <LoadingAnimation/>
          }
          {questionsAnswered.length > 6 && <StyledSummary></StyledSummary>}
        </Quiz>
      </ScrollWrapper>
      <StyledFooter></StyledFooter>
    </React.Fragment>
   );
}

const ScrollWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
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