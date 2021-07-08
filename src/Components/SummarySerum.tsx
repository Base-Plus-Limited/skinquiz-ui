import React, { useContext, Fragment } from 'react';
import styled from 'styled-components';
import { IRowData } from '../Interfaces/RowData';
import { IShopifySerum, IShopifyUIProduct } from '../Interfaces/ShopifyProduct';
import { QuizContext } from '../QuizContext';

export interface SummarySerumProps {
  product: IShopifyUIProduct;
}

const StyledSummarySerum: React.FC<SummarySerumProps> = ({ product }: SummarySerumProps) => {

  const { cartData, updateCartData, serums, updateSerums } = useContext(QuizContext);

  const getProductPrice = () => {
    return Number(product.variants[0].price).toFixed(2);
  }

  const toggleProductAddToCart = () => {
    if (cartData.some(d => d.id === product.variants[0].id)) {
      updateCartData(cartData.filter(d => d.id !== product.variants[0].id));
      return;
    }
    const rowData: IRowData[] = [{  
      productName: `${product.title.split(" ")[0]} ${product.title.split(" ")[1]} ${product.title.split(" ")[2]}`,
      additionalInfo: `with ${product.title.split(" - ")[1]}`,
      price: getProductPrice(),
      id: product.variants[0].id,
      productType: "serum"
    }]
    updateCartData([...cartData, ...rowData]);
  }

  const toggleDescriptionVisibility = () => {
    if (product.isIngredientsPanelOpen) {
      product.isIngredientsPanelOpen = !product.isIngredientsPanelOpen;
    } else {
      product.isDescriptionPanelOpen = !product.isDescriptionPanelOpen;
    }
    updateSerums([...serums, (product as IShopifyUIProduct)])
  };

  const toggleFullIngredientsVisibility = () => {
    product.isIngredientsPanelOpen = !product.isIngredientsPanelOpen;
    updateSerums([...serums, (product as IShopifyUIProduct)]);
  };

  const getProductImage = () => {
    return product.images[0].src;
  }

  return (
    <Product>
      <FullIngredientsDescription className={`${product.isIngredientsPanelOpen ? "resetTransform" : ""}`}>
        <CloseDescriptionButton onClick={toggleDescriptionVisibility}>x</CloseDescriptionButton>
        {
          <Description className="fullIngredients">
          {product.ingredients}
          </Description>
        }
      </FullIngredientsDescription>
      <VariationDescription className={`${product.isDescriptionPanelOpen ? "resetTransform" : ""}`}>
        <CloseDescriptionButton onClick={toggleDescriptionVisibility}>x</CloseDescriptionButton>
        <Description>
          {
            <Fragment>
              <span>
                { (product as IShopifySerum).title.split("- ")[1] }
              </span>
              { (product as IShopifySerum).variationDescription }
            </Fragment> 
          }
        </Description>
      </VariationDescription>
      <img
        className="productImage"
        onClick={toggleProductAddToCart}
        src={getProductImage()} alt="" width="80" />
      <p
        onClick={toggleProductAddToCart}
        className="name"
      >{product.title}</p>
      <p className="desc">{product.description.substring(0, 100)+"..."}</p>
      <hr></hr>
      <ReadMoreText onClick={toggleDescriptionVisibility}>Read more about {product.title.split("- ")[1]}</ReadMoreText>
      {
        cartData.some(d => d.id === product.variants[0].id) ?
          (<RemoveFromRoutineButton
            onClick={toggleProductAddToCart}
          >
            <span>added</span>
            <span>remove</span>
          </RemoveFromRoutineButton>)
          :
          (
            <Fragment>
              <AddToRoutineButton
                onClick={toggleProductAddToCart}
              >
                <span>add to routine</span>
                <span>+ £{getProductPrice()}</span>
              </AddToRoutineButton>
            </Fragment>
          )
      }
      {
        <FullIngredientsButton
        className={product.isDescriptionPanelOpen ? "inactive" : ""}
          onClick={toggleFullIngredientsVisibility}
        >
          { 
            product.isIngredientsPanelOpen ? "close full ingredients" : "view full ingredients"
          }
        </FullIngredientsButton>
      }
    </Product>
  )
}

const SizeWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
  p {
    font-size: 11pt;
    margin: 0;
  }
`

const SizeButtonWrap = styled.div`
  
`

const FullIngredientsButton = styled.small`
  font-family: ${props => props.theme.bodyFont};
  text-decoration: underline;
  font-size: 9pt;
  transition: opacity ease 0.35s;
  color: ${props => props.theme.brandColours.baseDarkGreen}
`

const ToggleIngredientDescriptionButton = styled.p`
  padding: 10px 0;
  margin: 0;
  width: 100%;
  position: absolute;
  font-family: ${props => props.theme.subHeadingFont};
  bottom: 0;
  background: ${props => props.theme.brandColours.baseDefaultGreen};
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 9pt;
  @media screen and (min-width: 768px) {
    padding: 7px 0;
  }
`

const Description = styled.p`
  width: 80%;
  margin: 0 auto;
  padding: 0;
  font-size: 9pt;
  line-height: 1.4em;
  span {
    display: block;
    font-family: ${props => props.theme.subHeadingFont};
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    text-transform: uppercase;
    font-size: 10pt;
    margin-bottom: 3px;
    font-weight: 600;
  }
`

const CloseDescriptionButton = styled.span`
  position: absolute;
  top: 15px;
  font-size: 15pt;
  cursor: pointer;
  right: 15px;
  font-weight: 600;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
`

const FullIngredientsDescription = styled.div`
  width: 100%;
  height: calc(100% - 74px);
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
  z-index: 15;
`

const VariationDescription = styled.div`
  width: 100%;
  height: calc(100% - 74px);
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
  z-index: 25;
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

const ChangeIngredientButton = styled.p`
  background: #fff;
  border: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  text-transform: uppercase;
  font-family: ${props => props.theme.subHeadingFont};
  padding: 10px 12px;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 9pt;
  cursor: pointer;
  text-align: center;
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
  .productImage{
    margin: 0 auto 10px;
    display: block;
    cursor: pointer;
  }
  .name {
    text-transform: uppercase;
    font-size: 10pt;
    font-weight: 600;
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
    max-height: 40px;
    overflow: hidden;
    line-height: 1.4em;
  }
  .mixture {
    margin: 5px 0;
    font-family: ${props => props.theme.subHeadingFont};
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    font-size: 11pt;
    font-weight: 600;
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
  .fullIngredients{
    font-size:7.5pt;
    line-height: 1.7em;
  }
  .inactive {
    opacity: 0;
    pointer-events: none;
  }
`

export default StyledSummarySerum;