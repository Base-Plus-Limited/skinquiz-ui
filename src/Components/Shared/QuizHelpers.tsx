import { ICompletedQuizDBModel } from "../../Interfaces/CompletedQuizDBModel";
import { IErrorResponse } from "../../Interfaces/ErrorResponse";
import { IAnswer, IQuizQuestion } from "../../Interfaces/QuizQuestion";
import { getUrlBasedOnEnvironment } from "./EnvironmentHelper";

export const saveQuizToDatabase = (id: number, applicationErrorFunc: (value: React.SetStateAction<IErrorResponse>) => void, quizQuestions: IQuizQuestion[]) => {
  return fetch(`${getUrlBasedOnEnvironment()}/save-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache',
    body: JSON.stringify(returnCompletedQuizData(id, quizQuestions))
  })
}

const returnCompletedQuizData = (id: number, quizQuestions: IQuizQuestion[]): ICompletedQuizDBModel => {
  const completedQuiz: ICompletedQuizDBModel = {
    productId: id,
    quiz: quizQuestions.map(question => (
      {
        questionId: question.id,
        question: question.question,
        answer: question.customAnswer ? question.customAnswer : returnFormattedAnswers(question.answers)
      })
    )
  };
  return completedQuiz;
}

const returnFormattedAnswers = (answers: IAnswer[]) => {
  const selectedAnswers = answers.filter(answer => answer.selected);
  if (selectedAnswers.length === 2)
    return selectedAnswers.map(x => x.value).join(" & ");
  return String(selectedAnswers[0].value);
}