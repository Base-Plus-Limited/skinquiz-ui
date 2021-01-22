import React, { useContext } from 'react';
import styled from "styled-components";
import { EventType, IAnalyticsEvent } from '../Interfaces/Analytics';
import { ICompletedQuizDBModel } from '../Interfaces/CompletedQuizDBModel';
import ICustomProductDBModel from '../Interfaces/CustomProduct';
import { IErrorResponse } from '../Interfaces/ErrorResponse';
import { SerumType } from '../Interfaces/SerumTypes';
import { IIngredient, ProductType, WordpressProduct } from '../Interfaces/WordpressProduct';

import { QuizContext } from '../QuizContext';
import leavesIcon from './../Assets/leaves_icon.jpg';
import CartRow from './CartRow';
import StyledCartTotal from './CartTotal';
import { track } from './Shared/Analytics';
import { saveQuizToDatabase } from './Shared/QuizHelpers';
import StyledSummaryButton from './SummaryButton';
import StyledSummaryTitle from './SummaryTitle';

export interface SummaryCartProps {
  userName: string;
  sortedIngredients: IIngredient[];
}

const StyledSummaryCart: React.SFC<SummaryCartProps> = ({ userName, sortedIngredients }) => {

  const { uniqueId, cartData, setApplicationError, quizQuestions, baseIngredient } = useContext(QuizContext);

  const getCartItemType = () => cartData[0].productName.toLowerCase().includes("serum") ? "serum" : "moisturiser";

  const getTotalPrice = () => {
    const cartPrices = cartData.map(data => Number(data.price));
    return cartPrices.length !== 0 ?
      cartPrices.reduce((a, c) => a + c) :
      0
  }

  const getButtonText = () => {
    if (cartData.length === 1) {
      return `buy personalised ${getCartItemType()}`
    } else if(cartData.length === 2) {
      return "buy personalised routine"
    } else {
      return "Add a product to your routine"
    }
  }

  const sendToWordpress = async () => {
    return fetch('/api/new-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(getNewProduct())
    })
    .then(res => {
      if(res.ok)
        return res.json();
      res.json()
        .then((errorResponse: IErrorResponse) => {
          errorResponse.uiMessage = `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`;
          setApplicationError(errorResponse);
        })
    }) 
    .then((product: WordpressProduct) => product)
    .catch((error: IErrorResponse) => {
      setApplicationError({
        error: true,
        code: error.code,
        message: error.message,
        uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`
      })
      return undefined;
    });
  }

  const getNewProduct = () => {
    return {
      name: getProductName(),
      type: 'simple',
      regular_price: baseIngredient.price,
      purchase_note: `Your custom mixture will include ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
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
  }

  const saveProductToDatabase = (productId: number, event: IAnalyticsEvent, productType: ProductType) => {
    return track(event).then(() => {
      return fetch('/api/save-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(createFinalProductToSaveToDatabase(productId, productType))
      })
    });
  }

  const createFinalProductToSaveToDatabase = (productId: number, productType: ProductType) => {
    const databaseProduct: ICustomProductDBModel = {
      recommendedVariation: returnVariation(productType),
      newVariation: "",
      amended: false,
      productId
    };
    return databaseProduct;
  }

  const returnVariation = (type: ProductType) => {
    if (type === "moisturiser") {
      return sortedIngredients.map(ingredient => {
        return {
          name: ingredient.name,
          id: ingredient.id
        }
      })
    } else {
      return cartData[0].additionalInfo.split(" ")[1];
    }
  }

  const getProductName = (): string => {
    if(userName)
      return `${userName}'s Bespoke Moisturiser (${sortedIngredients[0].name}, ${sortedIngredients[1].name})`;
    return `Your Bespoke Moisturiser (${sortedIngredients[0].name} & ${sortedIngredients[1].name})`;
  }

  const addBundleToCart = () => {
    
  }

  const addMoisturiser = () => {
    sendToWordpress()
      .then(product => {
        if (product) {
          const analyticsEvent: IAnalyticsEvent = {
            event_type: "Quiz completed - Moisturiser Added To Cart",
            distinct_id: uniqueId,
            moisturiserId: product.id,
            ingredients: sortedIngredients.map(x => x.name).join(" & ")
          }
          Promise.allSettled([
            saveProductToDatabase(product.id, analyticsEvent, "moisturiser"),
            saveQuizToDatabase(product.id, setApplicationError, quizQuestions)
          ])
          .then(result => {
            if(result.some(x => x.status !== "rejected")) {
              window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${product.id}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer`)
              return;
            }
            setApplicationError({
              error: true,
              code: 400,
              message: "",
              uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`
            })
          })
        }
      })
  }

  const addSerum = () => {
    const serumId = cartData[0].id;
    const analyticsEvent: IAnalyticsEvent = {
      event_type: "Quiz completed - Serum Added To Cart",
      distinct_id: uniqueId,
      serumId
    }
    Promise.allSettled([
      saveProductToDatabase(serumId, analyticsEvent, "serum"),
      saveQuizToDatabase(serumId, setApplicationError, quizQuestions)
    ])
    .then(result => {
      if(result.some(x => x.status !== "rejected")) {
        window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${serumId}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer`);
        return;
      }
      setApplicationError({
        error: true,
        code: 400,
        message: "",
        uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your serum. Please refresh and try again`
      })
    })
  }

  const addToCart = () => {
    if (cartData.length === 2) {
      // add bundle
    } else if(cartData.some(x => x.productType === "serum")) {
      addSerum();
    } else {
      addMoisturiser();
    }
  }

  return (
    <SummaryCartWrap>
      <StyledSummaryTitle
        heading={`${userName ? ` ${userName}'s Skincare Routine` : 'Your Skincare Routine'}`}
        imageUrl={leavesIcon}
        subHeading={"Personalised by you, formulated by us"}
      >
      </StyledSummaryTitle>
      <CartRows>
        {cartData.map(data => <CartRow key={data.id} rowData={data}></CartRow>)}
        {
          cartData.length !== 0 &&
          <StyledCartTotal price={getTotalPrice()}>
          </StyledCartTotal>
        }
        <StyledSummaryButton
          clickHandler={addToCart}
          addClass={cartData.length === 0}>
            { 
              getButtonText()
            }
        </StyledSummaryButton>
      </CartRows>
    </SummaryCartWrap>
  );
}

const SummaryCartWrap = styled.div`
  @media screen and (min-width: 768px) {
    grid-column: 3;
    padding-top: 15px;
  }
`

const CartRows = styled.div`
  .disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`
export default StyledSummaryCart;