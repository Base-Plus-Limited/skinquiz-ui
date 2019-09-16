import React, { useContext, ChangeEvent } from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import StyledAnswer from './Answer';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';
import { ICompletedQuiz } from '../Interfaces/CompletedQuiz';
import StyledInput from './Shared/Input';
import { StyledButton } from './Button';

export interface QuestionProps {
  questions: IQuizQuestion[];
}

const StyledQuestion: React.FC<QuestionProps> = ({ questions }: QuestionProps) => {
  const [questionOne, questionTwo] = questions;

  const { questionInputAnswer, updateQuestionInputAnswer, quizQuestions, updateQuizQuestions, ingredients, updateIngredients, questionsAnswered, updateQuestionsAnswered, progressCount } = useContext(QuizContext);

  const selectAnswer = (answeredQuestion: IQuizQuestion, answerIndex: number) => {
    const updatedQuestions = quizQuestions.map(question => {
      if (answeredQuestion.id === question.id) {
        question.answers.forEach(answer => {
          answer.selected = false;
          if (answer.id === answeredQuestion.answers[answerIndex].id){
            if(answeredQuestion.answers[answerIndex].meta[answerIndex] === "custom") {
              question.answered = false;
              showInput(answeredQuestion.id);
            } else {
              question.answered = true;
              question.customAnswer = "";
              answer.selected = true;
              doValuesMatch(answeredQuestion.answers[answerIndex], answerIndex);
            }
          }
        })
      }
      return question;
    });
    updateQuizQuestions(updatedQuestions);
    if (answeredQuestion.answered)
      doQuestionIdsMatch(answeredQuestion);
    // getCompletedQuizQuestions();
  }

  const showInput = (questionId: number) => {
    const updatedVisibilityQuestions = (questions.map(question => {
      if (question.id === questionId) {
        question.isInputVisible = true;
        return question;
      }
    }) as IQuizQuestion[]);
    updateQuizQuestions([...updatedVisibilityQuestions]);
  }

  const logQuestionInput = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuestionInputAnswer(e.target.value);
  }

  const customAnswerWrapperHandler = (questionId?: number) => {
    if (questionId) {
      if (questionInputAnswer.length) {
        submitAnswer(questionId);
      }
      return;
    }
    hideInput();
  }

  const hideInput = () => {
    quizQuestions.forEach(question => {
      question.isInputVisible = false;
    });
    updateQuizQuestions([...quizQuestions]);
  }

  const submitAnswer = (questionId: number) => {
    quizQuestions.forEach(question => {
      if (question.id === questionId) {
        question.customAnswer = questionInputAnswer;
        question.answered = true;
        doQuestionIdsMatch(question);
        setCustomAnswerAsSelected(question);
      }
    });
    updateQuizQuestions([...quizQuestions]);
    console.log(quizQuestions);
  }

  const setCustomAnswerAsSelected = (question: IQuizQuestion) => {
    question.answers[question.answers.length - 1].selected = true;
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
        {questionOne.isInputVisible ?
          <span>
            <StyledInput logInputValue={logQuestionInput} width="500px" placeholderText="Let us know" type="text"></StyledInput>
            <StyledButton addMargin onClickHandler={() => customAnswerWrapperHandler()}>close</StyledButton>
            <StyledButton onClickHandler={() => customAnswerWrapperHandler(questionOne.id)}>submit</StyledButton>
          </span>
          :
          <React.Fragment>
            {questionOne.answers.map((answer: IAnswer, index: number) => {
              return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionOne, index)} key={index}>{answer.value}</StyledAnswer>
            })}
          </React.Fragment>
        }
      </Question>
      <Question>
        {questionTwo.question} <br/>
        {questionTwo.prompt && <Prompt> {questionTwo.prompt} </Prompt>} <br/>
        {questionTwo.isInputVisible ?
          <span>
            <StyledInput logInputValue={logQuestionInput} width="500px" placeholderText="Let us know" type="text"></StyledInput> 
            <StyledButton addMargin onClickHandler={() => customAnswerWrapperHandler()}>close</StyledButton>
            <StyledButton onClickHandler={() => customAnswerWrapperHandler(questionTwo.id)}>submit</StyledButton>
          </span>
          :
          <React.Fragment>
            {questionTwo.answers.map((answer: IAnswer, index: number) => {
              return <StyledAnswer selected={answer.selected} selectAnswer={() => selectAnswer(questionTwo, index)} key={index}>{answer.value}</StyledAnswer>
            })}
          </React.Fragment>
        }
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