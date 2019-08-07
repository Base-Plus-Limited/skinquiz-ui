import * as React from 'react';
import StyledHeader from "../Components/Header";
import StyledFooter from '../Components/Footer';
import styled from 'styled-components';

export interface QuizProps {
  
}
 
const StyledQuiz: React.FC<QuizProps> = () => {
  return ( 
    <Quiz>
      <StyledHeader></StyledHeader>
      <StyledFooter></StyledFooter>
    </Quiz>
   );
}

const Quiz = styled.div`
  height: 100vh;
  position: relative;
`;
 
export default StyledQuiz;