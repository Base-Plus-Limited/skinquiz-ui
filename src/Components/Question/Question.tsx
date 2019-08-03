import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InitialState } from './../../State/InitialState';
import { increment } from './../../Actions/QuestionActions';

export interface QuestionProps {
  question: string;
  helper?: string;
}

const Question: React.FC<QuestionProps> = ({ question, helper }: QuestionProps) => {
  const currentCount = useSelector((state: InitialState) => state.count);
  const dispatch = useDispatch();

  const incrementCount = () => dispatch(increment());
  
  return (
    <p onClick={incrementCount}>
      <span>dssdsd</span>
      {question} {currentCount}
      {helper && <span> {helper} </span>}
    </p>
  )
}


export default Question;