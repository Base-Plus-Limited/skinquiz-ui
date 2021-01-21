import React, { useContext } from 'react';
import styled from "styled-components";

import { QuizContext } from '../QuizContext';
import leavesIcon from './../Assets/leaves_icon.jpg';
import CartRow from './CartRow';
import StyledCartTotal from './CartTotal';
import StyledSummaryButton from './SummaryButton';
import StyledSummaryTitle from './SummaryTitle';

export interface SummaryCartProps {
  userName: string;
}

const StyledSummaryCart: React.SFC<SummaryCartProps> = ({ userName }) => {

  const { cartData } = useContext(QuizContext);

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