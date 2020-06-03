export interface ICompletedQuiz {
  id: number;
  date: string;
  quiz: IData[];
}

export interface IData {
  answer: string;
  question: string;
  questionId: number;
}