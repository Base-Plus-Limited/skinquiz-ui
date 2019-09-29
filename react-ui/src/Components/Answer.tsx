import React from 'react';
import Tick from './Tick';
import styled from 'styled-components';

export interface AnswerProps {
  value: string | string[];
  selected: boolean;
  selectAnswer: () => void
}
 
const StyledAnswer: React.FC<AnswerProps> = ({ selectAnswer, selected, value }: AnswerProps) => {
  return <Answer onClick={selectAnswer}>
    {selected && <Tick></Tick>}
    {value}
  </Answer>
}

const Answer = styled.span`
  padding: 10px 15px;
  background: #fff;
  display: none;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  margin: 4px;
  cursor: pointer;
  display: inline-block;
  font-size: 9.5pt;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  position: relative;
`
 
export default StyledAnswer;