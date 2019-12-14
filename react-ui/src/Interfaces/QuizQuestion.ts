export interface IQuizQuestion {
  id: number;
  answered: boolean;
  question: string;
  customAnswer: string;
  totalAnswersSelected: number;
  prompt: string | string[];
  isInputVisible: boolean;
  displayAnswersAsADropdownOnMobile: boolean;
  isSkintoneQuestion: boolean;
  isSkinConditionQuestion: boolean;
  answers: IAnswer[];
}

export interface IAnswer {
  value: string | string[];
  selected: boolean;
  id: string;
  disable: boolean;
  meta: string[];
  skinColour: string;
}
