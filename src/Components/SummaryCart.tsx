import React, { useContext } from 'react';
import styled from "styled-components";
import { IAnalyticsEvent } from '../Interfaces/Analytics';
import ICustomProductDBModel from '../Interfaces/CustomProduct';
import { IErrorResponse } from '../Interfaces/ErrorResponse';
import { IRowData } from '../Interfaces/RowData';
import { IIngredient, IShopifyProduct, IShopifySerum, ProductType } from '../Interfaces/ShopifyProduct';
import { QuizContext } from '../QuizContext';
import leavesIcon from './../Assets/leaves_icon.jpg';
import CartRow from './CartRow';
import StyledCartTotal from './CartTotal';
import { track } from './Shared/Analytics';
import { getUrlBasedOnEnvironment } from './Shared/EnvironmentHelper';
import { saveQuizToDatabase } from './Shared/QuizHelpers';
import StyledSummaryButton from './SummaryButton';
import StyledSummaryTitle from './SummaryTitle';

export interface SummaryCartProps {
  userName: string;
  sortedIngredients: IIngredient[];
}

const StyledSummaryCart: React.SFC<SummaryCartProps> = ({ userName, sortedIngredients }) => {

  const { analyticsId, cartData, toggleLoading, serums, setApplicationError, quizQuestions, moisturiserSizes, longUniqueId } = useContext(QuizContext);

  const getCartItemType = () => cartData[0].productName.toLowerCase().includes("serum") ? "serum" : "moisturiser";

  const getTotalPrice = () => {
    const cartPrices = cartData.map(data => Number(data.price));
    return cartPrices.length !== 0 ?
      cartPrices.reduce((a, c) => a + c) :
      0
  }

  const getButtonText = () => {
    if (cartData.length === 1) {
      return `buy personalised ${getCartItemType()}`;
    } else if(cartData.length === 2) {
      return "buy personalised routine";
    } else {
      return "Add a product to your routine";
    }
  }

  const sendToShopify = async (data: any) => {
    return fetch(`${getUrlBasedOnEnvironment()}/create-new-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(data)
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
    .then((response: {id: number}) => response.id)
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

  const createCustomMoisturiser = () => {
    return {
      product: {
        title: getProductName(),
        vendor: "Base Plus",
        body_html: "",
        product_type: "custom",
        metafields: [generateMetaField()],
        images: [
          {
            "src": getSelectedSize() === "50ml" ? 'https://cdn.shopify.com/s/files/1/0571/8694/3125/products/basetubeedited-e1590996899944_5f7e98f0-4131-4c71-a18e-5414a34d359c.png?v=1625339571' : "https://cdn.shopify.com/s/files/1/0571/8694/3125/products/base-moistuirser-small-scaled.jpg?v=1625340030"
          }
        ],
        variants: [
          {
            price: (cartData.find(cd => cd.productType === "moisturiser") as IRowData).price
          }
        ]
      }
    }
  }

  const createCustomSerum = () => {
    const variantId = (cartData.find(cd => cd.productType === "serum") as IRowData).id;
    const selectedSerum = (serums.find(s => s.variants[0].id === variantId) as IShopifyProduct)
    return {
      product: {
        title: userName ? `${userName}'s ${selectedSerum.title}` : `Your ${selectedSerum.title}`,
        vendor: "Base Plus",
        body_html: "",
        product_type: "custom",
        metafields: [generateMetaField()],
        images: [
          {
            src: "https://cdn.shopify.com/s/files/1/0571/8694/3125/products/serum_4878a439-0a20-443a-988a-1e07a66abacf.png"
          }
        ],
        variants: [
          {
            price: (cartData.find(cd => cd.productType === "serum") as IRowData).price
          }
        ]
      }
    }
  }

  const saveProductToDatabase = (event: IAnalyticsEvent, productType: ProductType) => {
    return track(event).then(() => {
      return fetch(`${getUrlBasedOnEnvironment()}/save-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(createFinalProductToSaveToDatabase(productType))
      })
    });
  }

  const generateMetaField = () => {
    return {
      namespace: "skin_quiz_data",
      key: "quiz_id",
      value: longUniqueId,
      description: "Quiz id to link an order to a quiz for analysis",
      value_type: "integer"
    }
  }

  const createFinalProductToSaveToDatabase = (productType: ProductType) => {
    const databaseProduct: ICustomProductDBModel = {
      recommendedVariation: returnVariation(productType),
      newVariation: "",
      amended: false,
      productId: longUniqueId
    };
    return databaseProduct;
  }

  const returnVariation = (type: ProductType) => {
    if (type === "moisturiser") {
      return sortedIngredients.map(ingredient => (
        {
          name: ingredient.title,
          id: ingredient.id
        }
      ))
    } else if(type === "serum") {
      return cartData[0].additionalInfo.split(" ")[1];
    } else {
      const mixture = sortedIngredients.map(ingredient => ingredient.title).join(" & ");
      const serumVariation = (cartData.find(d => d.productType === "serum") as IRowData).additionalInfo.split(" ")[1];
      return `Moisturiser: ${mixture}, Serum: ${serumVariation}`;
    }
  }

  const getProductName = (): string => {
    if(userName)
      return `${userName}'s Bespoke Moisturiser (${sortedIngredients[0].title}, ${sortedIngredients[1].title}), ${getSelectedSize()}`;
    return `Your Bespoke Moisturiser (${sortedIngredients[0].title} & ${sortedIngredients[1].title}), ${getSelectedSize()}`;
  }

  const getSelectedSize = () => moisturiserSizes.filter(s => s.selected)[0].size;

  const addMoisturiser = () => {
    sendToShopify(createCustomMoisturiser())
      .then(id => {
        if (id === undefined) {
          setApplicationError({
            error: true,
            code: 400,
            message: "",
            uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your moisturiser. Please refresh and try again`
          })
        } else {
          const analyticsEvent: IAnalyticsEvent = {
            event_type: "Quiz completed - Moisturiser Added To Cart",
            distinct_id: analyticsId,
            moisturiserId: id,
            variation: sortedIngredients.map(x => x.title).join(" & ")
          }
          Promise.all([
            saveProductToDatabase(analyticsEvent, "moisturiser"),
            saveQuizToDatabase(longUniqueId, setApplicationError, quizQuestions)
          ])
            .then(results => {
              if (results.some(result => result.ok !== false)) {
                window.location.assign(`https://base-plus-skincare.myshopify.com/cart/${id}:1`)
                return;
              }
            })
            .catch(error => {
              setApplicationError({
                error: true,
                code: 400,
                message: "",
                uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your moisturiser. Please refresh and try again`
              })
            })
        }
      });
  }

  const addSerum = () => {
    sendToShopify(createCustomSerum())
    .then(id => {
      if (id === undefined) {
        setApplicationError({
          error: true,
          code: 400,
          message: "",
          uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your serum. Please refresh and try again`
        })
      } else {
        const analyticsEvent: IAnalyticsEvent = {
          event_type: "Quiz completed - Serum Added To Cart",
          distinct_id: analyticsId,
          serumId: id
        }
        Promise.all([
          saveProductToDatabase(analyticsEvent, "serum"),
          saveQuizToDatabase(longUniqueId, setApplicationError, quizQuestions)
        ])
          .then(results => {
            if (results.some(result => result.ok !== false)) {
              window.location.assign(`https://base-plus-skincare.myshopify.com/cart/${id}:1`)
              return;
            }
          })
          .catch(error => {
            setApplicationError({
              error: true,
              code: 400,
              message: "",
              uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your moisturiser. Please refresh and try again`
            })
          })
      }
    });
  }

  const addBundle = () => {
    Promise.all([
      sendToShopify(createCustomSerum()),
      sendToShopify(createCustomMoisturiser())
    ])
      .then(([serumId,moisturiserId]) => {
        if ((serumId === undefined) || (moisturiserId === undefined)) {
          setApplicationError({
            error: true,
            code: 400,
            message: "",
            uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to add your moisturiser. Please refresh and try again`
          });
        } else {
          const serum = (cartData.find(x => x.productType === "serum") as IRowData);
          const moisturiserVariation = (cartData.find(x => x.productType === "moisturiser") as IRowData).additionalInfo;
          const analyticsEvent: IAnalyticsEvent = {
            event_type: "Quiz completed - Bundle Added To Cart",
            distinct_id: analyticsId,
            moisturiserId,
            serumId,
            variation: `Moisturiser: ${moisturiserVariation.split("with ")[1]}, Serum: ${serum.additionalInfo.split(" ")[1]}`
          }
          Promise.all([
            saveProductToDatabase(analyticsEvent, "bundle"),
            saveQuizToDatabase(longUniqueId, setApplicationError, quizQuestions)
          ])
          .then(results => {
            if (results.some(result => result.ok !== false)) {
              window.location.assign(`https://base-plus-skincare.myshopify.com/cart/${moisturiserId}:1,${serumId}:1`);
            }
          });
        };
      });
  }

  const addToCart = () => {
    toggleLoading(true);
    if (cartData.length === 2) {
      addBundle();
    } else if (cartData.some(x => x.productType === "serum")) {
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
        {cartData.map(data => <CartRow key={data.id} rowData={data} size={getSelectedSize()}></CartRow>)}
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