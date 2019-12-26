import * as React from 'react';
import { useEffect, useContext } from 'react';
import { QuizContext } from '../QuizContext';
import StyledErrorScreen from '../Components/Shared/ErrorScreen';
import { ICompletedQuiz } from '../Interfaces/CompletedQuiz';


export interface DownloadDataProps {
  
}
 
const DownloadData: React.SFC<DownloadDataProps> = () => {
  const { setApplicationError, hasApplicationErrored } = useContext(QuizContext);

  let completedQuizData: ICompletedQuiz[] = [];

  useEffect(() => {
    fetch('/api/completed-quiz')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .then((quizData: ICompletedQuiz[]) => {
        completedQuizData = quizData;
        console.log(quizData)
      })
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

  }, [setApplicationError]);

  return (
    hasApplicationErrored.error ?
      <StyledErrorScreen message="Unable to retrieve data from database"></StyledErrorScreen>
      :
      <React.Fragment>
        <h1>DownloadData</h1>
          <p>
          {completedQuizData && completedQuizData.length}
          </p>
      </React.Fragment>
  );
}
 
export default DownloadData;