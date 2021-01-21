import React, { useContext } from 'react';
import styled from 'styled-components';

import { IIngredient, ISerum } from '../Interfaces/WordpressProduct';
import { QuizContext } from '../QuizContext';

export interface SummaryProductProps {
  product: ISerum | IIngredient;
  ingredients?: IIngredient[];
}

const StyledSummaryProduct: React.FC<SummaryProductProps> = ({ product, ingredients }: SummaryProductProps) => {

  const { cartData, updateCartData, serums, updateSerums, updateBaseIngredient } = useContext(QuizContext);

  enum ProductTypeId {
    Moisturiser = 1474
  }

  const formatIngredientNames = () => isProductAMoisturiser() && (ingredients as IIngredient[]).map(i => i.name).join(" & ");

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
      additionalInfo = `with ${formatIngredientNames()}`;
      price = String(product.price);
    }
    updateCartData([...cartData, ...[{
      productName, 
      additionalInfo, 
      price,
      id
    }]]);
  }

  const toggleDescriptionVisibility = () => {
    product.isDescriptionOpen = !product.isDescriptionOpen;
    if (isProductAMoisturiser()) {
      const ingredientCopy: IIngredient = JSON.parse(JSON.stringify(product));
      updateBaseIngredient(ingredientCopy)
    } else {
      updateSerums([...serums, (product as ISerum)])
    }
  };

  const toggleIngredientDescriptions = () => {
    return (ingredients as IIngredient[])[0].short_description;
  }

  const isProductAMoisturiser = () => product.id === ProductTypeId.Moisturiser;

  return (
    <Product>
      <FullDescriptionPanel className={product.isDescriptionOpen ? "resetTransform" : ""}>
        <CloseDescriptionButton onClick={toggleDescriptionVisibility}>X</CloseDescriptionButton>
        <Description>
          {
            product.short_description
          }
        </Description>
        <ToggleIngredientDescriptionButton>View x</ToggleIngredientDescriptionButton>
      </FullDescriptionPanel>
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
        ingredients &&
        <p className="mixture">
          {formatIngredientNames()}
        </p>
      }
      <hr></hr>
      <ReadMoreText onClick={toggleDescriptionVisibility}>Read more about {ingredients ? formatIngredientNames() : product.name.split("- ")[1]}</ReadMoreText>
      {
        // ADD IN ABILITY TO CHANGE INGREDIENTS FOR MOISTURISER
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
            <span>+ £{product.price}</span>
          </AddToRoutineButton>
      }
    </Product>
  )
}

const ToggleIngredientDescriptionButton = styled.p`
  padding: 7px 0;
  margin: 0;
  width: 100%;
  position: absolute;
  font-family: ${props => props.theme.subHeadingFont};
  bottom: 0;
  background: ${props => props.theme.brandColours.baseDefaultGreen};
  color: #fff;
`

const Description = styled.p`
  width: 80%;
  margin: 0 auto;
  padding: 0;
  font-size: 10pt;
  line-height: 1.4em;
`

const CloseDescriptionButton = styled.span`
  position: absolute;
  top: 15px;
  font-size: 12pt;
  cursor: pointer;
  right: 15px;
  font-weight: 600;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
`
const FullDescriptionPanel = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 9.5pt;
  text-align: center;
  background: #fff;
  display: flex;
  align-items: center;
  transition: all 0.55s ease-in-out;
  transform: translateX(100%);
  position: absolute;
  top: 0;
`

const ReadMoreText = styled.p`
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 9.5pt;
  font-weight: 600;
  line-height: 1.4em;
  cursor: pointer;
  margin: 0;
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
  position: relative;
  overflow: hidden;
  .resetTransform {
    transform: translateX(0);
  }
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