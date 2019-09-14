import React, { createContext, SetStateAction, useState } from 'react';
import { IQuizQuestion } from './Interfaces/QuizQuestion';
import IQuiz from './Interfaces/QuizState';
import { IIngredient } from './Interfaces/WordpressProduct';

const state: IQuiz = {
  progressCount: 0,
  updateCount: (previousCount: SetStateAction<number>) => previousCount,
  quizQuestions: [],
  updateQuizQuestions: (previousQuizQuestions: SetStateAction<IQuizQuestion[]>) => previousQuizQuestions,
  ingredients: [],
  updateIngredients: (previousIngredients: SetStateAction<IIngredient[]>) => previousIngredients,
  questionsAnswered: [],
  updateQuestionsAnswered: (previousQuestionsAnswered: SetStateAction<IQuizQuestion[]>) => previousQuestionsAnswered,
  questionInputAnswer: "",
  updateQuestionInputAnswer: (previousQuestionsAnswered: SetStateAction<string>) => previousQuestionsAnswered
}

export const QuizContext = createContext(state);

interface QuizProviderProps {
}
 
export const QuizProvider: React.SFC<QuizProviderProps> = ({ children }) => {

  const [progressCount, updateCount] = useState<number>(0);
  const [quizQuestions, updateQuizQuestions] = useState<IQuizQuestion[]>([]);
  const [ingredients, updateIngredients] = useState<IIngredient[]>([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState<IQuizQuestion[]>([]);
  const [questionInputAnswer, updateQuestionInputAnswer] = useState<string>("");

  return (
    <QuizContext.Provider value={{
      progressCount,
      updateCount,
      quizQuestions,
      updateQuizQuestions,
      ingredients,
      updateIngredients,
      questionsAnswered,
      updateQuestionsAnswered,
      questionInputAnswer,
      updateQuestionInputAnswer
    }}>
      {children}
    </QuizContext.Provider>
  );
}
 
