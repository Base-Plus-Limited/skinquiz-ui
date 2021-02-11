import React from 'react';
import styled from "styled-components";

import { IRowData } from "../Interfaces/RowData";

export interface CartRowProps {
  rowData: IRowData; 
  size?: string; 
}
 
const StyledCartRow: React.SFC<CartRowProps> = ({rowData, size}) => {

  const getNamePart = () => {
    const splitName = rowData.productName.split(" ");
    return rowData.productName.toLowerCase().includes("serum") ?
      `${splitName[0]} ${splitName[1]} ${splitName[2]}` :
      `${rowData.productName}, ${size}`;
  }

  return ( 
    <Row>
      <ProductInfo>
        <ProductInfoLine>{getNamePart()}</ProductInfoLine>
        <ProductInfoLine>{rowData.additionalInfo}</ProductInfoLine>
      </ProductInfo>
      <Price>£{rowData.price}</Price>
    </Row>
   );
}



const Price = styled.span`
  font-weight: bold;
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
`

const ProductInfoLine = styled.span`
  display: block;
  &:nth-of-type(1) {
    font-weight: bold;
    font-size: 12pt;
  }
  &:nth-of-type(2) {
    font-size: 8pt;
    font-weight: normal;
    margin-top: 1px;
  }
`

const ProductInfo = styled.p`
  margin: 0;
  text-align: left;
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
`

const Row = styled.div`
  display: flex;
  border-bottom: solid 1px rgba(191,191,191,.3);
  justify-content: space-between;
  padding-bottom: 13px;
  margin-bottom: 13px;
  align-items: center;
`


export default StyledCartRow;