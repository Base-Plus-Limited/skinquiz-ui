import React from 'react';
import styled from 'styled-components';

export interface SummaryIngredientProps {
  description: string;
  name: string;
  usedFor: string[];
  price: string;
  imageUrl: string;
}
 
const StyledSummaryIngredient: React.FC<SummaryIngredientProps> = ({ description, name, price, imageUrl, usedFor }: SummaryIngredientProps) => {
  return (
    <Ingredient>
      <img src={imageUrl} alt=""/>
      <p className="name">{name}<span className="price">£{price}</span></p>
      <p className="desc">{description}</p>
      <p className="usedFor"> <span>commonly used for:</span> {usedFor.join(', ')}</p>
    </Ingredient> 
  )
}

const Ingredient = styled.div`
  text-align: center;
  margin: 0 auto 0;
  max-width: 90%;
  img{
    margin: 0 auto 10px;
    display: block;
    max-width: 100px;
  }
  .name {
    text-transform: uppercase;
    font-size: 9pt;
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
  }
  .usedFor {
    text-transform: uppercase;
    margin: 25px 0 0 0;
    font-family: ${props => props.theme.subHeadingFont};
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    font-size: 8pt;
    span {
      display: block;
    }
  }
  @media screen and (min-width: 768px) {
    max-width: 276px;
  }
`
 
export default StyledSummaryIngredient;