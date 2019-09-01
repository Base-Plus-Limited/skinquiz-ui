import styled from 'styled-components';
import React from 'react';

export interface ButtonProps {
  children: string[] | string;
  onClickHandler?: (() => void) | undefined;
  extraAnswerButton?: boolean;
}

const StyledButton: React.FC<ButtonProps> = ({ children, onClickHandler, extraAnswerButton }: ButtonProps) => {
  return <Button extraAnswerButton={extraAnswerButton} onClick={onClickHandler}>{children}</Button>
}

const Button = styled.button`
  padding: 10px 15px;
  background: #fff;
  outline: none;
  border: solid 2px ${props => props.theme.brandColours.baseDarkGreen};
  margin: ${(props: ButtonProps) => props.extraAnswerButton ? "0 8px 0 0" : "0 auto"};
  cursor: pointer;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`;

const StyledBackButton = styled(Button)`
  color: ${props => props.theme.brandColours.basePink};
  margin: 0;
  padding: 3px 10px;
  border: solid 2px ${props => props.theme.brandColours.basePink};
`

export { StyledButton, StyledBackButton };