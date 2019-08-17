import { IQuizQuestion } from "./QuizQuestion";
import { Dispatch, SetStateAction } from 'react';

interface IQuiz {
  progressCount: number;
  quizQuestions: IQuizQuestion[];
  updateCount: Dispatch<SetStateAction<number>>;
  updateQuizQuestions: Dispatch<SetStateAction<IQuizQuestion[]>>;
}

export default IQuiz;