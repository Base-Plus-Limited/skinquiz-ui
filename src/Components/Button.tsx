import * as React from 'react';
import Tick from './Tick';

export interface ButtonProps {
  answerType: string;
  value: string;
  className: string;
}

const Button: React.FC<ButtonProps> = ({ answerType, value, className }: ButtonProps) => (
  <button data-type={answerType} className={className}>
    <Tick></Tick>
    {value}
  </button>
);
export default Button;