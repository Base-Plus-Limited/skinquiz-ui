import React from 'react';
import styled from 'styled-components';

export interface SkintoneProps {
}
 
const StyledSkintone: React.SFC<SkintoneProps> = () => {
  return ( 
    <Skintone>  </Skintone>
   );
}

const Skintone = styled.span`
  background: ${props => props.theme.brandColours.basePink}
  padding: 19px 20px;
  margin-bottom: 5px;
  display: inline-block;
`

export default StyledSkintone;