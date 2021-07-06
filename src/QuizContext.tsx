import React, { createContext, SetStateAction, useState } from 'react';
import { IQuizQuestion } from './Interfaces/QuizQuestion';
import IQuiz from './Interfaces/QuizState';
import { ISkinCondition } from './Interfaces/SkinCondition';
import { IErrorResponse } from './Interfaces/ErrorResponse';
import { IDashboardValue } from './Interfaces/DashboardValue';
import { IRowData } from './Interfaces/RowData';
import { IMoisturiserSize } from './Interfaces/MoistuiserSize';
import { IShopifyUIProduct } from './Interfaces/ShopifyProduct';

const state: IQuiz = {
  cartData: [],
  updateCartData: (previousCartData: SetStateAction<IRowData[]>) => previousCartData,
  progressCount: 0,
  updateCount: (previousCount: SetStateAction<number>) => previousCount,
  quizQuestions: [],
  updateQuizQuestions: (previousQuizQuestions: SetStateAction<IQuizQuestion[]>) => previousQuizQuestions,
  ingredients: [],
  updateIngredients: (previousIngredients: SetStateAction<IShopifyUIProduct[]>) => previousIngredients,
  questionsAnswered: [],
  updateQuestionsAnswered: (previousQuestionsAnswered: SetStateAction<IQuizQuestion[]>) => previousQuestionsAnswered,
  questionInputAnswer: "",
  updateQuestionInputAnswer: (previousQuestionsAnswered: SetStateAction<string>) => previousQuestionsAnswered,
  selectedSkinConditions: [],
  updateSelectedSkinConditions: (previousselectedSkinConditions: SetStateAction<ISkinCondition[]>) => previousselectedSkinConditions,
  userName: "",
  updateUserName: (previousUserName: SetStateAction<string>) => previousUserName,
  baseIngredient: {} as IShopifyUIProduct,
  updateBaseIngredient: (previousBaseIngredient: SetStateAction<IShopifyUIProduct>) => previousBaseIngredient,
  isQuizCompleted: false,
  setQuizToCompleted: (previousCompletedQuizState: SetStateAction<boolean>) => previousCompletedQuizState,
  isAnswersPanelVisible: false,
  setAnswersPanelVisibility: (previousAnswersPanelVisibility: SetStateAction<boolean>) => previousAnswersPanelVisibility,
  hasApplicationErrored: {} as IErrorResponse,
  setApplicationError: (previousApplicationError: SetStateAction<IErrorResponse>) => previousApplicationError,
  dashboardValues: {} as IDashboardValue,
  saveDashboardValues: (previousDashboardValue: SetStateAction<IDashboardValue>) => previousDashboardValue,
  analyticsId: "",
  saveAnalyticsId: (previousAnalyticsId: SetStateAction<string>) => previousAnalyticsId,
  areSummaryCTAsVisible: false,
  showSummaryCTAs: (previousVisibility: SetStateAction<boolean>) => previousVisibility,
  serums: [],
  updateSerums: (perviousSerums: SetStateAction<IShopifyUIProduct[]>) => perviousSerums,
  isLoading: false,
  toggleLoading: (previousLoading: SetStateAction<boolean>) => previousLoading,
  isAmendSelected: false,
  toggleAmendSelected: (previousAmendState: SetStateAction<boolean>) => previousAmendState,
  moisturiserSizes: [{
    size: "30ml",
    selected: true,
    id: "30ml",
  },
  {
    size: "50ml",
    selected: false,
    id: "50ml",
  }],
  toggleSelectedMoisturiserSizes: (previousmoisturiserSizes: SetStateAction<IMoisturiserSize[]>) => previousmoisturiserSizes,
  toggleQuizVisibility: (previousQuizVisibility: SetStateAction<boolean>) => previousQuizVisibility,
  isQuizVisible: false,
  longUniqueId: 0,
  saveLongUniqueId: (previousLongUniquieId: SetStateAction<number>) => previousLongUniquieId,
}

export const QuizContext = createContext(state);

interface QuizProviderProps {
}
 
export const QuizProvider: React.SFC<QuizProviderProps> = ({ children }) => {

  const [cartData, updateCartData] = useState<IRowData[]>([]);
  const [progressCount, updateCount] = useState<number>(0);
  const [quizQuestions, updateQuizQuestions] = useState<IQuizQuestion[]>([]);
  const [ingredients, updateIngredients] = useState<IShopifyUIProduct[]>([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState<IQuizQuestion[]>([]);
  const [questionInputAnswer, updateQuestionInputAnswer] = useState<string>("");
  const [selectedSkinConditions, updateSelectedSkinConditions] = useState<ISkinCondition[]>([]);
  const [userName, updateUserName] = useState<string>("");
  const [baseIngredient, updateBaseIngredient] = useState<IShopifyUIProduct>({} as IShopifyUIProduct);
  const [isQuizCompleted, setQuizToCompleted] = useState<boolean>(false);
  const [isAnswersPanelVisible, setAnswersPanelVisibility] = useState<boolean>(false);
  const [hasApplicationErrored, setApplicationError] = useState<IErrorResponse>({} as IErrorResponse);
  const [dashboardValues, saveDashboardValues] = useState<IDashboardValue>({} as IDashboardValue);
  const [analyticsId, saveAnalyticsId] = useState<string>("");
  const [longUniqueId, saveLongUniqueId] = useState<number>(0);
  const [areSummaryCTAsVisible, showSummaryCTAs] = useState<boolean>(false);
  const [serums, updateSerums] = useState<IShopifyUIProduct[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [isAmendSelected, toggleAmendSelected] = useState<boolean>(false);
  const [isQuizVisible, toggleQuizVisibility] = useState<boolean>(false);
  const [moisturiserSizes, toggleSelectedMoisturiserSizes] = useState<IMoisturiserSize[]>([
    {
      id: "50ml",
      size: "50ml",
      selected: false
    },
    {
      id: "30ml",
      size: "30ml",
      selected: true
    }
  ]);

  return (
    <QuizContext.Provider value={{
      isQuizVisible,
      toggleQuizVisibility,
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
      analyticsId,
      saveAnalyticsId,
      areSummaryCTAsVisible,
      showSummaryCTAs,
      serums,
      updateSerums,
      isLoading,
      toggleLoading,
      isAmendSelected,
      toggleAmendSelected,
      moisturiserSizes,
      toggleSelectedMoisturiserSizes,
      longUniqueId,
      saveLongUniqueId
    }}>
      {children}
    </QuizContext.Provider>
  );
}
 
