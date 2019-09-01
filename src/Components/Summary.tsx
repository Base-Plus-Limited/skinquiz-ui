import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';

export interface SummaryProps {
}
 
const StyledSummary: React.FC<SummaryProps> = () => {
  return <Summary>Summary </Summary>
}

const Summary = styled.div`
display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
`
 
export default StyledSummary;