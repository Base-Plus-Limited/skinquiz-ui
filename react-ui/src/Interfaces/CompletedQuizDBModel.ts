export interface ICompletedQuizDBModel {
  quizData: IQuizData[];
}

export interface IQuizData {
  questionId: number;
  answer: string;
  question: string;
}