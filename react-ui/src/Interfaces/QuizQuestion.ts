export interface IQuizQuestion {
  id: number;
  answered: boolean;
  question: string;
  customAnswer: string;
  prompt: string | string[];
  isInputVisible: boolean;
  isSkintoneQuestion: boolean;
  isSkinConditionQuestion: boolean;
  answers: IAnswer[];
}

export interface IAnswer {
  value: string;
  selected: boolean;
  id: string;
  meta: string[];
}
