import styled from 'styled-components';
import React from 'react';

export interface ButtonProps {
  children: string[] | string;
  onClickHandler?: (() => void) | undefined;
  addMargin?: boolean;
}

const StyledButton: React.FC<ButtonProps> = ({ children, onClickHandler, addMargin }: ButtonProps) => {
  return <Button addMargin={addMargin} onClick={onClickHandler}>{children}</Button>
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

const StyledBackButton = styled(Button)`
  color: ${props => props.theme.brandColours.basePink};
  margin: -3px 0 0 0;
  padding: 3px 10px;
  border: solid 2px ${props => props.theme.brandColours.basePink};
`

const StyledSummaryButton = styled(Button)`
  margin: ${(props: ButtonProps) => props.addMargin ? "0 15px 0" : "0 auto"};
`

export { StyledButton, StyledBackButton, StyledSummaryButton };