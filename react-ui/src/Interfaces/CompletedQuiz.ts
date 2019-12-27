export interface ICompletedQuiz {
  completedQuiz: IQuizData;
}

export interface IQuizData {
  id: number;
  date: string;
  quizData: IData[];
}

export interface IData {
  answer: string;
  question: string;
  questionId: number;
}