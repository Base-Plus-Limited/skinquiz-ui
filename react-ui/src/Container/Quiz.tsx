import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion } from '../Interfaces/QuizQuestion';
import StyledQuestion from '../Components/Question';
import { QuizContext } from '../QuizContext';
import { IIngredient, ISerum } from '../Interfaces/WordpressProduct';
import StyledSummary from '../Components/Summary';
import LoadingAnimation from '../Components/Shared/LoadingAnimation';
import StyledErrorScreen from '../Components/Shared/ErrorScreen';


interface QuizProps {
  rows: number;
  marginValue: number;
}

const StyledQuiz: React.FC<QuizProps> = () => {

  const { saveSerums, quizQuestions, updateQuizQuestions, updateIngredients, questionsAnswered, updateCount, saveBaseIngredient, setApplicationError, hasApplicationErrored } = useContext(QuizContext);

  useEffect(() => {
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


    fetch('/api/serums')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .then((serums: ISerum[]) => saveSerums(serums))
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

  }, []);

  const formattedQuiz = () => {
    const skinConditionQuestion = quizQuestions.filter(question => question.id === 1443);
    const nonSkinConditionQuestions = quizQuestions.filter(question => question.id !== 1443);
    const formattedQuestions = nonSkinConditionQuestions.map((q, i) => {
      if (i % 2 === 0)
        return nonSkinConditionQuestions.slice(i, i + 2);
    }).filter(quizArr => quizArr !== undefined) as (IQuizQuestion[])[]
    formattedQuestions.splice(2, 0, skinConditionQuestion);
    setWhetherQuestionShouldDisplayFullScreen(formattedQuestions);
    return formattedQuestions;
  };

  const setWhetherQuestionShouldDisplayFullScreen = (questions: IQuizQuestion[][]) => {
    questions.forEach(questions => {
      if (questions.length !== 2)
        questions.map(x => x.isFullScreen = true)
    })
  }

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
      case 8:
        return 4;
      case 9:
        return 5;
      case 10:
        return 6;
      default:
        return 0;
    }
  }

  const getErrorMessage = () => {
    return `${hasApplicationErrored.uiMessage && hasApplicationErrored.uiMessage.length > 0 ? `${hasApplicationErrored.uiMessage}` : "We're unable to load the quiz at the moment, please try again later"}`
  }

  updateCount(questionsAnswered.length)

  return (
    hasApplicationErrored.error ?
      <StyledErrorScreen message={getErrorMessage()}></StyledErrorScreen>
      : <React.Fragment>
        <ScrollWrapper>
          <Quiz rows={formattedQuiz().length + 1} marginValue={returnMarginAmount()}>
            {
              formattedQuiz()[0].length ?
                formattedQuiz().map((formattedQ, index) => <StyledQuestion questions={formattedQ} key={index}></StyledQuestion>) :
                <LoadingAnimation loadingText="" />
            }
            {(quizQuestions.length && (questionsAnswered.length === quizQuestions.length)) && <StyledSummary></StyledSummary>}
          </Quiz>
        </ScrollWrapper>
      </React.Fragment>
  );
}

const ScrollWrapper = styled.div`
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