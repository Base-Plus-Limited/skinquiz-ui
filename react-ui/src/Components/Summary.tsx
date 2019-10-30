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

  return <SummaryWrap>
      <SummaryGrid>
        {<StyledH2 text={`Here's your product ${userName}`}></StyledH2>}
        {
          <SummaryIngredient>
            <StyledImage width={90} src={sortedIngredients[0].images[0].src} alt={sortedIngredients[0].name}></StyledImage>
            <StyledText margin="0 0 0 0" fontSize="10pt" text={sortedIngredients[0].name}></StyledText>
            <StyledText margin="4px 0 0 0" fontSize="9pt" text="Maiores consequatur sint quo nihil doloremque cum. Rerum unde"></StyledText>
          </SummaryIngredient>
        }
        <StyledHR></StyledHR>
        <SummaryIngredientWrap>
          {
            sortedIngredients.map((ingredient, index) => (
              <React.Fragment>
                <SummaryIngredient>
                  <StyledImage width={90} src={ingredient.images[0].src} alt={ingredient.name}></StyledImage>
                  <StyledText margin="0 0 0 0" fontSize="10pt" text={ingredient.name}></StyledText>
                  <StyledText margin="4px 0 0 0" fontSize="9pt" text="Maiores consequatur sint quo nihil doloremque cum. Rerum unde"></StyledText>
                </SummaryIngredient>
                {
                  index === 0 &&
                  <StyledImage isSummaryScreen={true} width={15} src={plusIcon} alt="Plus icon"></StyledImage>
                }
              </React.Fragment>
            ))
          }
        </SummaryIngredientWrap>
        <StyledHR></StyledHR>
        <StyledSummaryButton addMargin onClick={amendIngredients}>Amend</StyledSummaryButton>
        <StyledSummaryButton addMargin onClick={sendToWordpress}>Buy now</StyledSummaryButton>
      </SummaryGrid>
    </SummaryWrap>
}

const SummaryIngredientWrap = styled.div`
  position: relative;
`

const SummaryIngredient = styled.div`
  width: 230px;
  display: inline-block;
  margin: 0 30px;
`

const SummaryWrap = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
  grid-template-columns: 20px 1fr 20px;
  grid-template-rows: 0 1fr 0;
`

const SummaryGrid = styled.div`
  grid-template-columns: 120px 1fr 120px;
  grid-area: 2/2;
`
 
export default StyledSummary;