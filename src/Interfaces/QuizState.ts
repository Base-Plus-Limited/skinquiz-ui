import { IQuizQuestion } from "./QuizQuestion";
import { Dispatch, SetStateAction } from 'react';
import { IIngredient } from "./WordpressQuestion";

interface IQuiz {
  progressCount: number;
  updateCount: Dispatch<SetStateAction<number>>;
  quizQuestions: IQuizQuestion[];
  updateQuizQuestions: Dispatch<SetStateAction<IQuizQuestion[]>>;
  ingredients: IIngredient[];
  updateIngredients: Dispatch<SetStateAction<IIngredient[]>>;
}

export default IQuiz;