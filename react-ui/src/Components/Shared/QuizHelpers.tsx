import { ICompletedQuizDBModel } from "../../Interfaces/CompletedQuizDBModel";
import { IErrorResponse } from "../../Interfaces/ErrorResponse";
import { IAnswer, IQuizQuestion } from "../../Interfaces/QuizQuestion";

export const saveQuizToDatabase = (productId: number, applicationErrorFunc: (value: React.SetStateAction<IErrorResponse>) => void, quizQuestions: IQuizQuestion[]) => {
  return fetch('/api/save-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(returnCompletedQuizData(productId, quizQuestions))
  })
    .then(res => res.ok ? res.json() : res.json().then(errorResponse => applicationErrorFunc(errorResponse)))
    .catch(error => {
      applicationErrorFunc({
        error: true,
        code: error.status,
        message: error.message
      })
    });
}

const returnCompletedQuizData = (productId: number, quizQuestions: IQuizQuestion[]): ICompletedQuizDBModel => {
  const completedQuiz: ICompletedQuizDBModel = {
    productId: productId,
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