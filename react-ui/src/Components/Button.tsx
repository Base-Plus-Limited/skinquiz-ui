import styled from 'styled-components';
import React from 'react';

export interface ButtonProps {
  children: string[] | string;
  onClickHandler?: (() => void) | undefined;
  addMargin?: boolean;
  AnswerSelectedOnMobile?: boolean;
  entity?: string;
}

const StyledButton: React.FC<ButtonProps> = ({ entity, children, onClickHandler, addMargin, AnswerSelectedOnMobile }: ButtonProps) => {
  return <Button className={entity ? "hasEntity" : ""} style={{ border: AnswerSelectedOnMobile ? "solid 1px #C06F78" : "solid 1px #003E38" }} addMargin={addMargin} onClick={onClickHandler}>{children}</Button>
}

const Button = styled.button`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  margin: ${(props: ButtonProps) => props.addMargin ? "0 8px 0 0" : "0 auto"};
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  padding: 10px 15px;
  background: none;
  outline: none;
  font-size: 9pt
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  position: relative;
`;

const StyledBackButton = styled.button`
  color: ${props => props.theme.brandColours.basePink};
  margin: -3px 0 0 0;
  padding: 3px 10px;
  border: solid 2px ${props => props.theme.brandColours.basePink};
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
`

const StyledSummaryButton = styled.button`
  color: #fff;
  border: none;
  margin: ${(props: ButtonProps) => props.addMargin ? "0 15px 0" : "0 auto"};
  padding: 20px 15px;
  background:${props => props.theme.brandColours.baseDarkGreen};
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  width: 50%;
  @media screen and (min-width: 768px) {
    width: auto;
    padding: 12px 55px;
  }
  :nth-of-type(2) {
    border-left: solid 1px #fff;
  }
`

export { StyledButton, StyledBackButton, StyledSummaryButton };