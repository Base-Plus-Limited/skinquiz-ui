import * as React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  value: string;
}

const StyledButton: React.FC<ButtonProps> = ({ value }: ButtonProps) => (
  <Button> {value} </Button>
);

const Button = styled.button`
  padding: 10px 15px;
  background: green;
  outline: none;
  border-radius: 3px;
  border: none;
`;


export default StyledButton;