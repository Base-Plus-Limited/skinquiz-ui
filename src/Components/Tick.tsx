import React from 'react';
import styled from 'styled-components';

export interface TickProps {
  
}
 
const StyledTick: React.SFC<TickProps> = () => {
  return ( 
    <Tick> M </Tick>
   );
}

const Tick = styled.span`
  position: absolute;
  top: -13px;
  right: -12px;
  background: ${props => props.theme.brandColours.baseLightGreen}
  border-radius: 50%;
  z-index: 10;
  padding: 4px 6px;
`
 
export default StyledTick;