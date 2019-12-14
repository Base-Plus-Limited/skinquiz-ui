import React, { useContext } from 'react';
import Tick from './Tick';
import styled from 'styled-components';
import { StyledButton } from './Button';
import { IAnswer } from '../Interfaces/QuizQuestion';
import { QuizContext } from '../QuizContext';

interface MobileAnswersPanelProps {
  answers: IAnswer[]
}

interface PanelProps {
  isVisible: boolean;
}
 
const StyledMobileAnswersPanel: React.FC<MobileAnswersPanelProps> = ({ answers }) => {

  const { isAnswersPanelVisible, setAnswersPanelVisibility } = useContext(QuizContext);

  const toggleAnswers = () => {
    let toggle = isAnswersPanelVisible;
    setAnswersPanelVisibility(toggle = !toggle)
  }

  return <React.Fragment>
    <StyledButton onClickHandler={toggleAnswers}>Choose an Answer</StyledButton>
    <Panel isVisible={isAnswersPanelVisible}>
      panel
    </Panel>
  </React.Fragment>
}

const Panel = styled.div`
  display: ${(props: PanelProps) => props.isVisible ? "block" : "none"};
  padding: 10px 15px;
  background: #fff;
`
 
export default StyledMobileAnswersPanel;