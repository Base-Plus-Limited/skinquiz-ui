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
  color: ${props => props.theme.brandColours.baseDarkGreen};
  margin: ${(props: ButtonProps) => props.addMargin ? "0 8px 0 0" : "0 auto"};
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  padding: 10px 15px;
  background: none;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`;

const StyledBackButton = styled.button`
  color: ${props => props.theme.brandColours.basePink};
  margin: -3px 0 0 0;
  padding: 3px 10px;
  border: solid 2px ${props => props.theme.brandColours.basePink};
  background: none;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`

const StyledSummaryButton = styled.button`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  margin: ${(props: ButtonProps) => props.addMargin ? "0 15px 0" : "0 auto"};
  padding: 3px 10px;
  padding: 10px 15px;
  background: none;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`

export { StyledButton, StyledBackButton, StyledSummaryButton };