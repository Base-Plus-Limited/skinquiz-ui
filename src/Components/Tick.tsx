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
  top: 0;
  right: 0;
  background: ${props => props.theme.brandColours.baseLightGreen}
  border-radius: 50%;
`
 
export default StyledTick;