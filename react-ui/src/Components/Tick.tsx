import React from 'react';
import styled from 'styled-components';
import tick from './../Assets/tick.png';

export interface TickProps {
  
}
 
const StyledTick: React.SFC<TickProps> = () => {
  return ( 
    <Tick> <Image src={tick} alt="Selected"></Image> </Tick>
   );
}

const Tick = styled.span`
  position: absolute;
  top: -13px;
  right: -12px;
  background: ${props => props.theme.brandColours.basePink}
  border-radius: 50%;
  z-index: 10;
  padding: 3px 6px;
`

const Image = styled.img`
  width:10px;
`
 
export default StyledTick;