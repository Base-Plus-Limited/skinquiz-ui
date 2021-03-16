import React from 'react';
import styled from 'styled-components';
import tick from './../Assets/tick.png';

export interface TickProps {
  tickPadding?: string;
}
 
const StyledTick: React.SFC<TickProps> = ({ tickPadding }) => {
  return ( 
    <Tick style={{ padding: String(tickPadding) }}> <Image src={tick} alt="Selected"></Image> </Tick>
   );
}

const Tick = styled.span`
  position: absolute;
  top: -13px;
  right: 8px;
  background: ${props => props.theme.brandColours.basePink}
  border-radius: 50%;
  z-index: 10;
  padding: 3px 6px;
`

const Image = styled.img`
  width:10px;
`
 
export default StyledTick;