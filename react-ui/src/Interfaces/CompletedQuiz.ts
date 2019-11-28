export interface ICompletedQuiz {
  quizData: IQuizData[];
}

export interface IQuizData {
  questionId: number;
  answer: string;
  question: string;
}