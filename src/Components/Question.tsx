import React, { useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import StyledAnswer from './Answer';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';
import { ICompletedQuiz } from '../Interfaces/CompletedQuiz';

export interface QuestionProps {
  helper?: string;
  questions: IQuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions, helper }: QuestionProps) => {
  const [questionOne, questionTwo] = questions;

  const { quizQuestions, updateQuizQuestions, ingredients, updateIngredients, questionsAnswered, updateQuestionsAnswered, progressCount } = useContext(QuizContext);

  const selectAnswer = (answeredQuestion: IQuizQuestion, index: number) => {
    const updatedQuestions = quizQuestions.map(question => {
      if (answeredQuestion.id === question.id) {
        question.answered = true;
        question.answers.forEach(answer => {
          answer.selected = false;
          if (answer.id === answeredQuestion.answers[index].id){
            answer.selected = true;
            rankIngredients(answeredQuestion.answers[index], index);
          }
        })
      }
      return question;
    });
    updateQuizQuestions(updatedQuestions);
    doQuestionIdsMatch(answeredQuestion);
    getCompletedQuizQuestions();
  }

  const getCompletedQuizQuestions = () => { // TRIGGGER THIS WHEN FINAL INGREDIENTS ARE BEING SENT TO WORDPRESS
    if (progressCount === 4) {
      const completedQuizAnswers: ICompletedQuiz[] = questionsAnswered.map(answeredQ => {
        const { question, answers, id } = answeredQ;
        return {
          id,
          question,
          answer: answers.filter(answer => answer.selected)[0].value
        }
      })
      try {
        sendCompletedQuizQuestionsToApi(completedQuizAnswers)
      }
      catch (error) {
        console.log(error)
      }
    }
  }

  const sendCompletedQuizQuestionsToApi = (completedQuiz: ICompletedQuiz[]) => { 
    return fetch('/quiz-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(completedQuiz)
    })
    .then(response => response.json())
    .catch(error => console.error(error));
  }

  const doQuestionIdsMatch = (answeredQuestion: IQuizQuestion) => {
    if(questionsAnswered.length) {
      if (questionsAnswered[questionsAnswered.length - 1].id === answeredQuestion.id){
        return;
      }
      updateQuestionsAnswered([...questionsAnswered, answeredQuestion]);
    }
    updateQuestionsAnswered([...questionsAnswered, answeredQuestion]);
  }

  const doValuesMatch = (answerValue: string, tagValue: string, ingredient: IIngredient) => {
    if (answerValue === tagValue) {
      ingredients.forEach(ingredientFromList => {
        if (ingredientFromList.id === ingredient.id) 
          ingredient.rank = ingredient.rank + 1;
      })
    }
  }

  const rankIngredients = (answer: IAnswer, answerIndex: number) => {
    ingredients.forEach((ingredient: IIngredient) => {
      ingredient.tags.forEach(tag => {
        if(answer.meta[answerIndex] === undefined)
          return;
        if (answer.meta[answerIndex].includes(',')) {
          const metaArray = answer.meta[answerIndex].split(',');
          doValuesMatch(metaArray[answerIndex], tag.name, ingredient);
        } else {
          doValuesMatch(answer.meta[answerIndex], tag.name, ingredient);
        }
      })
    })

    updateIngredients(ingredients);
  }


  return (
    <QuestionWrapper>
      <Question>
        {questionOne.question} <br/>
        {helper && <span> {helper} </span>}  <br/>
        {questionOne.answers.map((answer: IAnswer, index: number) => {
          return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionOne, index)} key={index}>{answer.value}</StyledAnswer>
        })}
      </Question>
      <Question>
        {questionTwo.question} <br/>
        {helper && <span> {helper} </span>} <br/>
        {questionTwo.answers.map((answer: IAnswer, index: number) => {
          return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionTwo, index)} key={index}>{answer.value}</StyledAnswer>
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