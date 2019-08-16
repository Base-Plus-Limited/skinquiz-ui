import * as React from 'react';
import Tick from './Tick';
import styled from 'styled-components';

export interface AnswerProps {
  children: string;
  className?: string;
}
 
const StyledAnswer: React.FC<AnswerProps> = ({ children }: AnswerProps) => (
  <Answer>
    <Tick></Tick>
    {children}
  </Answer>
)

const Answer = styled.span`
  padding: 10px 15px;
  background: #fff;
  border: solid 2px ${props => props.theme.brandColours.baseDarkGreen};
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