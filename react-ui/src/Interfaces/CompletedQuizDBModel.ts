export interface ICompletedQuizDBModel {
  quiz: IQuizData[];
  productId: number;
}

export interface IQuizData {
  questionId: number;
  answer: string;
  question: string;
}