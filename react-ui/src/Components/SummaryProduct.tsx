import React, { useContext } from 'react';
import styled from 'styled-components';

import { IIngredient, ISerum } from '../Interfaces/WordpressProduct';
import { QuizContext } from '../QuizContext';

export interface SummaryProductProps {
  product: ISerum | IIngredient;
  mixture?: String;
  totalPrice?: string;
}

const StyledSummaryProduct: React.FC<SummaryProductProps> = ({ product, mixture, totalPrice }: SummaryProductProps) => {

  const { cartData, updateCartData } = useContext(QuizContext);

  const toggleProductAdd = () => {
    const { name, id } = product;
    if (cartData.some(d => d.id === id)) {
      updateCartData(cartData.filter(d => d.id !== id));
      return;
    }
    let price = "";
    const lowerCaseName = name.toLowerCase();
    let productName;
    let additionalInfo;
    if (lowerCaseName.includes("good skin")) {
      productName = `${name.split(" ")[0]} ${name.split(" ")[1]} ${name.split(" ")[2]}`;
      additionalInfo = `with ${name.split(" - ")[1]}`;
      price = product.price;
    } else {
      productName = name;
      additionalInfo = `with ${mixture}`;
      price = String(totalPrice);
    }
    updateCartData([...cartData, ...[{
      productName, 
      additionalInfo, 
      price,
      id
    }]]);
  }

  return (
    <Product>
      <img 
        onClick={toggleProductAdd}
        src={product.images[0].src} alt="" width={
          product.hasOwnProperty("isSelectedForUpsell") ?
            80
            :
            200
      } />
      <p 
        onClick={toggleProductAdd}
        className="name"
      >{product.name}</p>
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
      {
        cartData.some(d => d.id === product.id) ?
          <RemoveFromRoutineButton
            onClick={toggleProductAdd}
          >
            <span>added</span>
            <span>remove</span>
          </RemoveFromRoutineButton> 
          :
          <AddToRoutineButton
            onClick={toggleProductAdd}
          >
            <span>add to routine</span>
            <span>+ £{totalPrice ? totalPrice : product.price}</span>
          </AddToRoutineButton>
      }
    </Product>
  )
}

const ReadMoreText = styled.p`
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 9.5pt;
  font-weight: 600;
  line-height: 1.4em;
  cursor: pointer;
`

const RemoveFromRoutineButton = styled.p`
  border: solid 1px ${props => props.theme.brandColours.baseDefaultGreen};
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  display: flex;
  justify-content: space-between;
  font-size: 9pt;
  span{
    display: inline-block;
    padding: 10px 12px;
    &:first-child {
      background: ${props => props.theme.brandColours.baseDefaultGreen};
      color: #fff;
      width: 20%;
    }
    &:last-child {
      color: ${props => props.theme.brandColours.baseDefaultGreen};
      width: 80%;
      text-align: right;
      cursor: pointer;
    }
  }
`

const AddToRoutineButton = styled.p`
  background: ${props => props.theme.brandColours.baseDarkGreen};
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
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
    cursor: pointer;
  }
  .name {
    text-transform: uppercase;
    font-size: 10pt;
    cursor: pointer;
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