export interface ICompletedQuiz {
  id: number;
  date: string;
  productId: number;
  quiz: IData[];
}

export interface IData {
  answer: string;
  question: string;
  questionId: number;
}