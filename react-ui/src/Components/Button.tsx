import styled from 'styled-components';
import React from 'react';

export interface ButtonProps {
  children: string[] | string;
  onClickHandler?: (() => void) | undefined;
  addMargin?: boolean;
  AnswerSelectedOnMobile?: boolean;
}

const StyledButton: React.FC<ButtonProps> = ({ children, onClickHandler, addMargin, AnswerSelectedOnMobile }: ButtonProps) => {
  return <Button style={{ border: AnswerSelectedOnMobile ? "solid 1px #C06F78" : "solid 1px #003E38" }} addMargin={addMargin} onClick={onClickHandler}>{children}</Button>
}

const Button = styled.button`
  padding: 10px 15px;
  background: none;
  outline: none;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  margin: ${(props: ButtonProps) => props.addMargin ? "0 8px 0 0" : "0 auto"};
  cursor: pointer;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`;

const StyledBackButton = styled.button`
  color: ${props => props.theme.brandColours.basePink};
  border: solid 2px ${props => props.theme.brandColours.basePink};
  margin: -3px 0 0 0;
  padding: 3px 10px;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  background: none;
  outline: none;
`

const StyledSummaryButton = styled.button`
  margin: ${(props: ButtonProps) => props.addMargin ? "0 15px 0" : "0 auto"};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  padding: 10px 15px;
  background: none;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  outline: none;
`

export { StyledButton, StyledBackButton, StyledSummaryButton };