export interface IQuizQuestion {
  id: number;
  answered: boolean;
  hide: boolean;
  question: string;
  prompt: string;
  answers: IAnswer[];
}

export interface IAnswer {
  value: string;
  selected: boolean;
  id: string;
  meta: string[];
}
