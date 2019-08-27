import React, { useContext } from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import StyledAnswer from './Answer';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';
import { ICompletedQuiz } from '../Interfaces/CompletedQuiz';

export interface QuestionProps {
  questions: IQuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions }: QuestionProps) => {
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
            doValuesMatch(answeredQuestion.answers[index], index);
          }
        })
      }
      return question;
    });
    updateQuizQuestions(updatedQuestions);
    doQuestionIdsMatch(answeredQuestion);
    // getCompletedQuizQuestions();
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

  const rankIngredients = (answerValue: string, tagValue: string, ingredient: IIngredient) => {
    ingredient.previouslyRanked = false;
    if (answerValue === tagValue) {
      ingredient.previouslyRanked = true;
      ingredient.rank = ingredient.rank + 1;
    }
  }

  const doValuesMatch = (answer: IAnswer, answerIndex: number) => {
    ingredients.forEach((ingredient: IIngredient) => {
      ingredient.tags.forEach(tag => {
        if(answer.meta[answerIndex] === undefined)
          return;
        if (answer.meta[answerIndex].includes(',')) {
          const metaArray = answer.meta[answerIndex].split(',');
          rankIngredients(metaArray[answerIndex], tag.name, ingredient);
        } else {
          rankIngredients(answer.meta[answerIndex], tag.name, ingredient);
        }
      })
    })

    updateIngredients(ingredients);
  }


  return (
    <QuestionWrapper>
      <Question>
        {questionOne.question} <br/>
        {questionOne.prompt && <Prompt> {questionOne.prompt} </Prompt>}  <br/>
        {questionOne.answers.map((answer: IAnswer, index: number) => {
          return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionOne, index)} key={index}>{answer.value}</StyledAnswer>
        })}
      </Question>
      <Question>
        {questionTwo.question} <br/>
        {questionTwo.prompt && <Prompt> {questionTwo.prompt} </Prompt>} <br/>
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
  font-size: 11pt;
  font-family: ${props => props.theme.subHeadingFont}
  `;
  
  const Prompt = styled.span`
  margin: 4px 0 22px;
  font-size: 9.4pt;
  display: inline-block;
  font-family: ${props => props.theme.bodyFont}
  color: ${props => props.theme.brandColours.baseDarkGreen}
`;

const QuestionWrapper = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
`;

export default StyledQuestion;