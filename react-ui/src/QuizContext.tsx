import React, { createContext, SetStateAction, useState } from 'react';
import { IQuizQuestion } from './Interfaces/QuizQuestion';
import IQuiz from './Interfaces/QuizState';
import { IIngredient } from './Interfaces/WordpressProduct';
import { ISkinCondition } from './Interfaces/SkinCondition';
import { IErrorResponse } from './Interfaces/ErrorResponse';
import { ICompletedQuiz } from './Interfaces/CompletedQuiz';

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
  updateQuestionInputAnswer: (previousQuestionsAnswered: SetStateAction<string>) => previousQuestionsAnswered,
  selectedSkinConditions: [],
  updateSelectedSkinConditions: (previousselectedSkinConditions: SetStateAction<ISkinCondition[]>) => previousselectedSkinConditions,
  userName: "",
  updateUserName: (previousUserName: SetStateAction<string>) => previousUserName,
  baseIngredient: {} as IIngredient,
  saveBaseIngredient: (previousBaseIngredient: SetStateAction<IIngredient>) => previousBaseIngredient,
  isQuizCompleted: false,
  setQuizToCompleted: (previousCompletedQuizState: SetStateAction<boolean>) => previousCompletedQuizState,
  isAnswersPanelVisible: false,
  setAnswersPanelVisibility: (previousAnswersPanelVisibility: SetStateAction<boolean>) => previousAnswersPanelVisibility,
  hasApplicationErrored: {} as IErrorResponse,
  setApplicationError: (previousApplicationError: SetStateAction<IErrorResponse>) => previousApplicationError,
  completedQuizData: [],
  saveCompletedQuizData: (previousCompletedQuiz: SetStateAction<ICompletedQuiz[]>) => previousCompletedQuiz,
  uniqueId: "",
  saveUniqueId: (previousUniqueId: SetStateAction<string>) => previousUniqueId
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
  const [selectedSkinConditions, updateSelectedSkinConditions] = useState<ISkinCondition[]>([]);
  const [userName, updateUserName] = useState<string>("");
  const [baseIngredient, saveBaseIngredient] = useState<IIngredient>({} as IIngredient);
  const [isQuizCompleted, setQuizToCompleted] = useState<boolean>(false);
  const [isAnswersPanelVisible, setAnswersPanelVisibility] = useState<boolean>(false);
  const [hasApplicationErrored, setApplicationError] = useState<IErrorResponse>({} as IErrorResponse);
  const [completedQuizData, saveCompletedQuizData] = useState<ICompletedQuiz[]>([]);
  const [uniqueId, saveUniqueId] = useState<string>("");

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
      updateQuestionInputAnswer,
      selectedSkinConditions,
      updateSelectedSkinConditions,
      userName,
      updateUserName,
      baseIngredient,
      saveBaseIngredient,
      isQuizCompleted,
      setQuizToCompleted,
      isAnswersPanelVisible,
      setAnswersPanelVisibility,
      hasApplicationErrored,
      setApplicationError,
      completedQuizData,
      saveCompletedQuizData,
      uniqueId,
      saveUniqueId
    }}>
      {children}
    </QuizContext.Provider>
  );
}
 
