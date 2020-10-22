import React from 'react';
import styled from 'styled-components';
import plusIcon from './../Assets/plus.jpg';

export interface SummaryQuestionProps {
  questionText: string;
  answer: string;
}
 
const StyledSummaryQuestion: React.FC<SummaryQuestionProps> = ({ questionText, answer }: SummaryQuestionProps) => {
  return (
    <QuestionTextAndAnswer>
        {questionText}
        <span>
          <img src={plusIcon} alt=""/>
          {answer}
        </span>
    </QuestionTextAndAnswer> 
  )
}

const QuestionTextAndAnswer = styled.p`
  text-align: center;
  max-width: 80%;
  width: 100%;
  font-size: 11pt;
  margin: 0 auto 60px auto;
  font-family: ${props => props.theme.bodyFont};
  span {
    font-family: ${props => props.theme.subHeadingFont};
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    font-size: 12.5pt;
    margin: 10px 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    max-width: 8px;
    margin-right: 6px;
  }
  @media screen and (min-width: 768px) {
    max-width: 276px;
    margin: 0 auto;
  }
`
 
export default StyledSummaryQuestion;