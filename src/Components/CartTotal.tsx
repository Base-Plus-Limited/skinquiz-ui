import React from 'react';
import styled from "styled-components";

import { IRowData } from "../Interfaces/RowData";

export interface CartTotalProps {
  price: number; 
}
 
const StyledCartTotal: React.SFC<CartTotalProps> = ({price}) => {

  return ( 
    <Row>
      <ProductInfoLine>Total</ProductInfoLine>
      <Price>£{price.toFixed(2)}</Price>
    </Row>
   );
}



const Price = styled.span`
`

const ProductInfoLine = styled.span`
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.brandColours.baseDefaultGreen};
  font-family: ${props => props.theme.subHeadingFont};
  text-transform: uppercase;
  font-size: 13pt;
  font-weight: 600;
  margin-bottom: 15px;
`


export default StyledCartTotal;