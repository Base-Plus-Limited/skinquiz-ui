import React, { createContext, SetStateAction, useState } from 'react';
import { IQuizQuestion } from './Interfaces/QuizQuestion';
import IQuiz from './Interfaces/QuizState';
import { IIngredient, ISerum } from './Interfaces/WordpressProduct';
import { ISkinCondition } from './Interfaces/SkinCondition';
import { IErrorResponse } from './Interfaces/ErrorResponse';
import { IDashboardValue } from './Interfaces/DashboardValue';
import { IRowData } from './Interfaces/RowData';

const state: IQuiz = {
  cartData: [],
  updateCartData: (previousCartData: SetStateAction<IRowData[]>) => previousCartData,
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
  updateBaseIngredient: (previousBaseIngredient: SetStateAction<IIngredient>) => previousBaseIngredient,
  isQuizCompleted: false,
  setQuizToCompleted: (previousCompletedQuizState: SetStateAction<boolean>) => previousCompletedQuizState,
  isAnswersPanelVisible: false,
  setAnswersPanelVisibility: (previousAnswersPanelVisibility: SetStateAction<boolean>) => previousAnswersPanelVisibility,
  hasApplicationErrored: {} as IErrorResponse,
  setApplicationError: (previousApplicationError: SetStateAction<IErrorResponse>) => previousApplicationError,
  dashboardValues: {} as IDashboardValue,
  saveDashboardValues: (previousDashboardValue: SetStateAction<IDashboardValue>) => previousDashboardValue,
  uniqueId: "",
  saveUniqueId: (previousUniqueId: SetStateAction<string>) => previousUniqueId,
  areSummaryCTAsVisible: false,
  showSummaryCTAs: (previousVisibility: SetStateAction<boolean>) => previousVisibility,
  serums: [],
  updateSerums: (perviousSerums: SetStateAction<ISerum[]>) => perviousSerums,
  isLoading: false,
  toggleLoading: (previousLoading: SetStateAction<boolean>) => previousLoading
}

export const QuizContext = createContext(state);

interface QuizProviderProps {
}
 
export const QuizProvider: React.SFC<QuizProviderProps> = ({ children }) => {

  const [cartData, updateCartData] = useState<IRowData[]>([]);
  const [progressCount, updateCount] = useState<number>(0);
  const [quizQuestions, updateQuizQuestions] = useState<IQuizQuestion[]>([]);
  const [ingredients, updateIngredients] = useState<IIngredient[]>([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState<IQuizQuestion[]>([]);
  const [questionInputAnswer, updateQuestionInputAnswer] = useState<string>("");
  const [selectedSkinConditions, updateSelectedSkinConditions] = useState<ISkinCondition[]>([]);
  const [userName, updateUserName] = useState<string>("");
  const [baseIngredient, updateBaseIngredient] = useState<IIngredient>({} as IIngredient);
  const [isQuizCompleted, setQuizToCompleted] = useState<boolean>(false);
  const [isAnswersPanelVisible, setAnswersPanelVisibility] = useState<boolean>(false);
  const [hasApplicationErrored, setApplicationError] = useState<IErrorResponse>({} as IErrorResponse);
  const [dashboardValues, saveDashboardValues] = useState<IDashboardValue>({} as IDashboardValue);
  const [uniqueId, saveUniqueId] = useState<string>("");
  const [areSummaryCTAsVisible, showSummaryCTAs] = useState<boolean>(false);
  const [serums, updateSerums] = useState<ISerum[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(false);

  return (
    <QuizContext.Provider value={{
      cartData,
      updateCartData,
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
      updateBaseIngredient,
      isQuizCompleted,
      setQuizToCompleted,
      isAnswersPanelVisible,
      setAnswersPanelVisibility,
      hasApplicationErrored,
      setApplicationError,
      dashboardValues,
      saveDashboardValues,
      uniqueId,
      saveUniqueId,
      areSummaryCTAsVisible,
      showSummaryCTAs,
      serums,
      updateSerums,
      isLoading,
      toggleLoading
    }}>
      {children}
    </QuizContext.Provider>
  );
}
 
