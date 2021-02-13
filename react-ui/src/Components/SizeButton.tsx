import React from 'react';
import Tick from './Tick';
import styled from 'styled-components';

export interface SizeProps {
  children: any;
  selected: boolean;
  selectSize: () => void
}
 
const StyledSizeButton: React.FC<SizeProps> = ({ selectSize, selected, children }: SizeProps) => {
  return <Size className={`${selected ? "selectedAnswer" : ""}`} onClick={selectSize}>
    {selected && <Tick></Tick>}
    {children}
  </Size>
}

const Size = styled.span`
  padding: 15px;
  background: #fff;
  display: none;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  margin: 4px;
  display: inline-block;
  font-size: 9.5pt;
  cursor: pointer;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  position: relative;
  align-self: center;
  @media screen and (min-width: 620px) {
    padding: 10px 15px;
  }
`
 
export default StyledSizeButton;