export interface QuizQuestion {
  id: number;
  answered: boolean;
  hide: boolean;
  question: string;
  answers: Answer[];
}

interface Answer {
  value: string;
  selected: boolean;
  id: string;
  meta: string[];
}
