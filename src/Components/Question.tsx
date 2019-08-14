import * as React from 'react';

export interface QuestionProps {
  question: string;
  helper?: string;
}

const Question: React.FC<QuestionProps> = ({ question, helper }: QuestionProps) => {
  return (
    <p>
      {question}
      {helper && <span> {helper} </span>}
    </p>
  )
}


export default Question;