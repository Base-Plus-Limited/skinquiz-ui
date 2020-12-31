import React, { useContext } from 'react';
import styled from 'styled-components';
import { IIngredient, ISerum } from '../Interfaces/WordpressProduct';

export interface SummaryProductProps {
  product: ISerum | IIngredient;
  mixture?: String;
  totalPrice?: string;
}

const StyledSummaryProduct: React.FC<SummaryProductProps> = ({ product, mixture, totalPrice }: SummaryProductProps) => {

  return (
    <Product>
      <img src={product.images[0].src} alt="" width={
        product.hasOwnProperty("isSelectedForUpsell") ?
          80
          :
          200
      } />
      <p className="name">{product.name}</p>
      <p className="desc">{
        product.hasOwnProperty("isSelectedForUpsell") ?
          product.short_description
          :
          "Personalised with:"
      }</p>
      {
        mixture &&
        <p className="mixture">
          {mixture}
        </p>
      }
      <hr></hr>
      <ReadMoreText>Read more about {mixture ? mixture : product.name.split("- ")[1]}</ReadMoreText>
      <AddToRoutineButton>
        <span>add to routine</span>
        <span>+ £{totalPrice ? totalPrice : product.price}</span>
      </AddToRoutineButton>
    </Product>
  )
}

const ReadMoreText = styled.p`
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 9.5pt;
  font-weight: 600;
  cursor: pointer;
`

const AddToRoutineButton = styled.p`
  background: ${props => props.theme.brandColours.baseDarkGreen};
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 9pt;
  cursor: pointer;
`

const Product = styled.div`
  text-align: center;
  margin: 0 auto 60px;
  max-width: 260px;
  width: 100%;
  img{
    margin: 0 auto 10px;
    display: block;
  }
  .name {
    text-transform: uppercase;
    font-size: 10pt;
    margin: 0 0 5px;
    border-left: ${props => props.theme.brandColours.baseDarkGreen};
    font-family: ${props => props.theme.subHeadingFont};
  }
  .price {
    border-left: solid 2px ${props => props.theme.brandColours.baseDefaultGreen};
    padding: 0 0 0 8px;
    margin: 0 0 0 8px;
    color: ${props => props.theme.brandColours.baseDefaultGreen};
  }
  .desc {
    color: ${props => props.theme.brandColours.baseDarkGreen};
    font-family: ${props => props.theme.bodyFont};
    margin: 0 0 10px 0;
    font-size: 9pt;
    max-height: 50px;
    overflow: hidden;
    line-height: 1.4em;
  }
  .mixture {
    margin: 5px 0;
    font-family: ${props => props.theme.subHeadingFont};
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    font-size: 11pt;
    text-transform: uppercase;
  }
  hr {
    border: none;
    max-width: 210px;
    margin: 10px auto;
    border-bottom: solid 1px rgba(151,151,151,0.2);
  }
  @media screen and (min-width: 768px) { 
    margin: 0 auto 20px;
  }
`

export default StyledSummaryProduct;