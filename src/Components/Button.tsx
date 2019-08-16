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
  background: #fff;
  outline: none;
  border: solid 2px ${props => props.theme.brandColours.baseDarkGreen};
  margin: 0 auto;
  cursor: pointer;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`;


export default StyledButton;