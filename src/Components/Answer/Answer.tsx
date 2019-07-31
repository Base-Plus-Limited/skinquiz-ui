import * as React from 'react';


export interface AnswerProps {
  answer: string;
  
}
 
const Answer: React.FC<AnswerProps> = ({ answer }: AnswerProps) => {
  return (
    <p>{answer}</p>
  );
}
 
export default Answer;