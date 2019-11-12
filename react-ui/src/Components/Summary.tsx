import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';
import StyledText from './Shared/Text';
import StyledH2 from './Shared/H2';
import StyledHR from './Shared/HR';
import StyledSubHeading from './Shared/SubHeading';
import StyledImage from './Shared/Image';
import plusIcon from './../Assets/plus.jpg';
import { WordpressProduct } from '../Interfaces/WordpressProduct';
import { IAnswer } from '../Interfaces/QuizQuestion';
import { ICompletedQuiz } from '../Interfaces/CompletedQuiz';

export interface SummaryProps {
}
 
const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName, baseIngredient, quizQuestions } = useContext(QuizContext);
  const sortedIngredients =
  ingredients
    .sort((ingredientA, ingredientB) => ingredientA.rank - ingredientB.rank)
    .reverse()
    .slice(0, 2);

  function getProductName(): string {
    if(userName)
      return `${userName}'s Bespoke Product`;
    return `Your Bespoke Product`;
  }

  function getTotalPrice() {
    const total = Number(sortedIngredients[0].price) + Number(sortedIngredients[1].price) + Number(baseIngredient.price);
    return total.toFixed(2);
  }

  const newProduct = {
    name: getProductName(),
    type: 'simple',
    regular_price: getTotalPrice(),
    description: '',
    short_description: `Your custom mixture including ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
    categories: [
      {
        id: 21
      }
    ],
    images: [
      {
        src: 'http://baseplus.co.uk/wp-content/uploads/2018/12/productImageDefault.jpg'
      }
    ]
  }

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
    return fetch('/api/new-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then((product: WordpressProduct) => {
      sendCompletedQuizQuestionsToApi();
      // window.location.assign(`https://baseplus.co.uk/cart?add-to-cart=${product.id}`)
    })
    .catch(error => console.error(error));
  }

  function returnCompletedQuizData(): any {
    return quizQuestions.map(question => (
      {
        id: question.id,
        question: question.question,
        answer: question.customAnswer ? question.customAnswer : returnAnswers(question.answers)
      }
    ));
  }

  function returnAnswers(answers: IAnswer[]) {
    const selectedAnswers = answers.filter(answer => answer.selected).map(answer => answer.value)[0];
    if (Array.isArray(selectedAnswers))
      return selectedAnswers.join(" & ");
    return selectedAnswers;
  }

  const sendCompletedQuizQuestionsToApi = () => { 
    console.log(returnCompletedQuizData())
    // return fetch('/api/completed-quiz', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   cache: 'no-cache',
    //   body: JSON.stringify(returnCompletedQuizData())
    // })
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(error => console.error(error));
  }

  return <SummaryWrap>
      <SummaryGrid>
        {<StyledH2 text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH2>}
        {
          <SummaryBaseIngredient>
            <StyledImage src={baseIngredient.images[0].src} alt={baseIngredient.name}></StyledImage>
            <div>

            <StyledSubHeading margin="0 0 0 0" fontSize="10pt" text={baseIngredient.name}></StyledSubHeading>
            <StyledText margin="4px 0 0 0" fontSize="9pt" text={baseIngredient.short_description}></StyledText>
            </div>
          </SummaryBaseIngredient>
        }
        <StyledHR></StyledHR>
        <SummaryIngredientWrap>
          {
            sortedIngredients.map((ingredient, index) => (
              <React.Fragment key={index}>
                <SummaryIngredient key={ingredient.id}>
                  <StyledImage src={ingredient.images[0].src} alt={ingredient.name}></StyledImage>
                  <StyledSubHeading margin="0 0 0 0" fontSize="10pt" text={ingredient.name}></StyledSubHeading>
                  <StyledText margin="4px 0 0 0" fontSize="9pt" text={ingredient.short_description}></StyledText>
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

const SummaryBaseIngredient = styled.div`
  width: 380px;
  display: grid;
  grid-template-columns: 170px 1fr;
  margin: 0 auto;
  align-items: center;
  text-align: left;
  img{
    grid-area: 1
  }
`

const SummaryIngredient = styled.div`
  width: 230px;
  display: inline-block;
  margin: 0 30px;
  img{
    width: 90px;
  }
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