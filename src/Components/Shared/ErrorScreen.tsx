import * as React from 'react';
import styled from 'styled-components';
import StyledH2 from './H2';
import StyledText from './Text';
import productSpill from './../../Assets/productSpil.jpg';
import StyledImage from './Image';

export interface ErrorScreenProps {
  message: string;
}

const StyledErrorScreen: React.SFC<ErrorScreenProps> = ({ message }) => {
  return ( 
    <ErrorScreen>
      <ErrorScreenWrapper>
        <StyledImage src={productSpill} alt=""></StyledImage>
        <StyledH2 text="Oh no, something went wrong"></StyledH2>
        <StyledText fontSize="10pt" text={message}></StyledText>
      </ErrorScreenWrapper>
    </ErrorScreen>
   );
}

const ErrorScreen = styled.div`
  display:grid;
  grid-template-rows: repeat(2, 1fr);
`

const ErrorScreenWrapper = styled.div`
  text-align: center;
  max-width: 100%;
  width: 90%;
  margin: auto;
  grid-row: 1/span 2;
  img{
    max-width: 130px; 
  }
`

export default StyledErrorScreen;