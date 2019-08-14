import React, { useEffect, useState } from 'react';
import StyledHeader from "../Components/Header";
import StyledFooter from '../Components/Footer';
import styled from 'styled-components';
import { QuizQuestion } from '../Interfaces/QuizQuestion';

export interface QuizProps {
  
}

const StyledQuiz: React.FC<QuizProps> = () => {

  const [quizData, updateQuizData]: [QuizQuestion[], Function] = useState([]);

  useEffect(() => {
    fetch('/quiz')
      .then(res => res.json())
      .then((questions: QuizQuestion[]) => updateQuizData(questions))
      .catch(error => console.error(error));
  }, []);




  return ( 
    <Quiz>
      <StyledHeader></StyledHeader>
      {
        quizData.length ? quizData.length : 'Loading...'
      }
      <StyledFooter></StyledFooter>
    </Quiz>
   );
}

const Quiz = styled.div`
  height: 100vh;
  position: relative;
`;
 
export default StyledQuiz;