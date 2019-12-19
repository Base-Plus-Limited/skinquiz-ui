import React from 'react';
import Tick from './Tick';
import styled from 'styled-components';

export interface AnswerProps {
  value: string | string[];
  selected: boolean;
  isDisabled: boolean;
  selectAnswer: () => void
}
 
const StyledAnswer: React.FC<AnswerProps> = ({ selectAnswer, selected, value, isDisabled }: AnswerProps) => {
  return <Answer style={isDisabled ? { opacity: 0.2, pointerEvents: "none", } : { cursor: "pointer" }} onClick={selectAnswer}>
    {selected && <Tick></Tick>}
    {value}
  </Answer>
}

const Answer = styled.span`
  padding: 15px;
  background: #fff;
  display: none;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  margin: 4px;
  display: inline-block;
  font-size: 9.5pt;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  position: relative;
  align-self: center;
  @media screen and (min-width: 768px) {
    padding: 10px 15px;
  }
`
 
export default StyledAnswer;