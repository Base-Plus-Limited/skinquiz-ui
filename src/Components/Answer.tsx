import * as React from 'react';
import Tick from './Tick';

export interface AnswerProps {
  answer: string;
  className: string;
}
 
const Answer: React.FC<AnswerProps> = ({ answer }: AnswerProps) => (
  <p>
    <Tick></Tick>
    {answer}
  </p>
)
 
export default Answer;