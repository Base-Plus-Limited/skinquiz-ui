import { IQuizData } from "./CompletedQuizDBModel";

export default interface ISerumQuizDBModel {
  quiz: IQuizData[];
  quizId: number;
  selectedSerum: string;
  selectedSerumId: number;
  recommendedSerum: string;
  recommendedSerumId: number;
}
