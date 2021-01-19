import styled from 'styled-components';
import React from 'react';

export interface SummaryButtonProps {
  children: string;
  clickHandler?: () => void;
  addClass: boolean;
}

const StyledSummaryButton: React.FC<SummaryButtonProps> = ({ children, clickHandler, addClass }: SummaryButtonProps) => {

  return (
    <SummaryButton
      className={addClass ? "disabled" : ""}
      onClick={clickHandler}>
      {children}
    </SummaryButton>
  )
}

const SummaryButton = styled.button`
  color: #fff;
  margin: 20px 0 20px;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  background: ${props => props.theme.brandColours.baseDarkGreen};
  padding: 10px 15px;
  outline: none;
  font-size: 9pt
  cursor: pointer;
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  position: relative;
  width: 100%;

`;

export default StyledSummaryButton;