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
import { IQuizData } from '../Interfaces/CompletedQuizDBModel';
import LoadingAnimation from './Shared/LoadingAnimation';
import { IErrorResponse } from '../Interfaces/ErrorResponse';

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName, baseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, hasApplicationErrored, isQuizCompleted } = useContext(QuizContext);
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
    .catch(error => {
      setApplicationError({
        error: true,
        code: error.status,
        message: error.message
      })
    });
  }

  const sendToWordpress = async () => {
    completeQuiz();
    sendCompletedQuizQuestionsToApi();
    return fetch('/api/new-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(newProduct)
    })
    .then(res => res.ok ? res.json() : res.json().then((errorResponse: IErrorResponse) => {
      errorResponse.uiMessage = `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`;
      setApplicationError(errorResponse);
    }))
    .then((product: WordpressProduct) => {
      if(product)
        window.location.assign(`https://baseplus.co.uk/cart?add-to-cart=${product.id}`)
    })
    .catch((error: IErrorResponse) => {
      setApplicationError({
        error: true,
        code: error.code,
        message: error.message,
        uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`
      })
    });
  }

  const completeQuiz = () => {
    setQuizToCompleted(true);
  }

  function returnCompletedQuizData(): IQuizData[] {
    const quizData: IQuizData[] = quizQuestions.map(question => (
      {
        questionId: question.id,
        question: question.question,
        answer: question.customAnswer ? question.customAnswer : returnAnswers(question.answers)
      }
    ));
    return quizData;
  }

  function returnAnswers(answers: IAnswer[]) {
    const selectedAnswers = answers.filter(answer => answer.selected).map(answer => answer.value)[0];
    if (Array.isArray(selectedAnswers))
      return selectedAnswers.join(" & ");
    return selectedAnswers;
  }

  const sendCompletedQuizQuestionsToApi = () => {
    return fetch('/api/save-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(returnCompletedQuizData())
    })
    .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
    .catch(error => {
      console.log(error)
      setApplicationError({
        error: true,
        code: error.status,
        message: error.message
      })
    });
  }

  return (
    <React.Fragment>
      <SummaryWrap>
        <SummaryGrid>
          {
            isQuizCompleted ?
              <div>
                <LoadingAnimation />
                <StyledText margin="0" text={`Thank you${userName ? ` ${userName}` : ''}, please wait whilst we create your bespoke product`}></StyledText>
              </div>
              :
              <React.Fragment>
                {<StyledH2 margin="7px 0 7px" text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH2>}
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
              </React.Fragment>
          }
        </SummaryGrid>
      </SummaryWrap>
    </React.Fragment>
  )
}

const SummaryIngredientWrap = styled.div`
  position: relative;
`

const SummaryBaseIngredient = styled.div`
  display: grid;
  margin: 0 auto;
  align-items: center;
  width: 190px;
  img{
    margin: 0 auto;
  }
  p{
    height: 30px;
    overflow: hidden;
  }
  @media screen and (min-width: 768px) {
    img{
      grid-area: 1
    }
    text-align: left;
    grid-template-columns: 170px 1fr;
    width: 380px;
  }
`

const SummaryIngredient = styled.div`
  display: inline-block;
  img{
    width: 90px;
  }
  @media screen and (min-width: 768px) {
    margin: 0 30px;
    width: 230px;
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