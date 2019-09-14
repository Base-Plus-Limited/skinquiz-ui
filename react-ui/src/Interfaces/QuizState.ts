import { IQuizQuestion } from "./QuizQuestion";
import { Dispatch, SetStateAction } from 'react';
import { IIngredient } from "./WordpressProduct";

interface IQuiz {
  progressCount: number;
  updateCount: Dispatch<SetStateAction<number>>;
  quizQuestions: IQuizQuestion[];
  updateQuizQuestions: Dispatch<SetStateAction<IQuizQuestion[]>>;
  ingredients: IIngredient[];
  updateIngredients: Dispatch<SetStateAction<IIngredient[]>>;
  questionsAnswered: IQuizQuestion[];
  updateQuestionsAnswered: Dispatch<SetStateAction<IQuizQuestion[]>>;
  questionInputAnswer: string;
  updateQuestionInputAnswer: Dispatch<SetStateAction<string>>;
}

export default IQuiz;