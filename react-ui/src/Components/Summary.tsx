import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';
import StyledText from './Shared/Text';
import StyledH2 from './Shared/H2';
import StyledHR from './Shared/HR';
import StyledImage from './Shared/Image';
import plusIcon from './../Assets/plus.jpg';

export interface SummaryProps {
}
 
const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName } = useContext(QuizContext);
  const sortedIngredients = ingredients.sort((ingredientA, ingredientB) => ingredientA.rank - ingredientB.rank).slice(0, 2);

  const amendIngredients = async () => {
    return fetch('/customisation-tool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(sortedIngredients)
    })
    .then(response => response.json())
    .catch(error => console.error(error));
  }

  const sendToWordpress = async () => {
    window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${sortedIngredients[0].id}`);
  }

  
  // const navigateTo = (type: string, product:) => {
  //   type === 'amend' ?
  //     window.location.assign(product.permalink) :
  //     window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${product.id}`);
  // }

  return <React.Fragment>
    <SummaryWrap>
      <SummaryGrid>
        {<StyledH2 text={`Here's your product ${userName}`}></StyledH2>}
        {
          <SummaryIngredient>
            <StyledImage src={sortedIngredients[0].images[0].src} alt={sortedIngredients[0].name}></StyledImage>
            <StyledText margin="0 0 0 0" text={sortedIngredients[0].name}></StyledText>
          </SummaryIngredient>
        }
        <StyledHR width="40%"></StyledHR>
        {
          sortedIngredients.map((ingredient, index) => (
            <React.Fragment>
              <SummaryIngredient>
                <StyledImage src={ingredient.images[0].src} alt={ingredient.name}></StyledImage>
                <StyledText margin="0 0 0 0" text={ingredient.name}></StyledText>
              </SummaryIngredient>
              {
                index === 0 &&
                <StyledImage width={20} src={plusIcon} alt="Plus icon"></StyledImage>
              }
            </React.Fragment>
          ))
        }
        <StyledHR width="40%"></StyledHR>
        <StyledSummaryButton addMargin onClick={amendIngredients}>Amend</StyledSummaryButton>
        <StyledSummaryButton addMargin onClick={sendToWordpress}>Buy now</StyledSummaryButton>
      </SummaryGrid>
    </SummaryWrap>
  </React.Fragment>
}

const SummaryIngredient = styled.div`
  width: 110px;
  display: inline-block;
  margin: 0 30px;
`

const SummaryWrap = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
  grid-template-columns: 120px 1fr 120px;
  grid-template-rows: 0 1fr 0;
`

const SummaryGrid = styled.div`
  grid-template-columns: 120px 1fr 120px;
  grid-area: 2/2;
`
 
export default StyledSummary;