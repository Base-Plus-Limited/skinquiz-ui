import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';

export interface SummaryProps {
}
 
const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients } = useContext(QuizContext);
  const sortedIngredients = ingredients.sort((ingrdientA, ingredientB) => ingrdientA.rank - ingredientB.rank).slice(0, 2);

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

  
  const navigateTo = (type, product) => {
    type === 'amend' ?
      window.location.assign(product.permalink) :
      window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${product.id}`);
  }

  return <React.Fragment>
    <SummaryWrap>
      <SummaryGrid>
        <p> base+ ingredient </p>
        <span>{sortedIngredients[0].name}</span>
        <span>{sortedIngredients[1].name}</span>
        <hr/>
        <StyledSummaryButton addMargin onClick={amendIngredients}>Amend</StyledSummaryButton>
        <StyledSummaryButton addMargin onClick={sendToWordpress}>Buy now</StyledSummaryButton>
      </SummaryGrid>
    </SummaryWrap>
  </React.Fragment>
}

const SummaryWrap = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
  grid-template-columns: 120px 1fr 120px;
  grid-template-rows: 120px 1fr 120px;
`

const SummaryGrid = styled.div`
  grid-template-columns: 120px 1fr 120px;
  grid-area: 2/2;
`
 
export default StyledSummary;