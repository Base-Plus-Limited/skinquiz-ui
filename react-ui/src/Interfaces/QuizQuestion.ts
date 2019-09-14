export interface IQuizQuestion {
  id: number;
  answered: boolean;
  question: string;
  customAnswer: string;
  prompt: string;
  isInputVisible: boolean;
  answers: IAnswer[];
}

export interface IAnswer {
  value: string;
  selected: boolean;
  id: string;
  meta: string[];
}
