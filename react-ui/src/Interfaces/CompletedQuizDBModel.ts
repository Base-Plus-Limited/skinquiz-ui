export interface ICompletedQuizDBModel {
  quiz: IQuizData[];
}

export interface IQuizData {
  questionId: number;
  answer: string;
  question: string;
}