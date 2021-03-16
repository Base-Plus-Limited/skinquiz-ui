import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { ReactComponent as baseplus_icon } from './../../Assets/bplus_icon.svg';
import StyledText from './Text';

export interface LoadingAnimationProps {
  loadingText: string;
}

const LoadingAnimation: React.SFC<LoadingAnimationProps> = ({ loadingText }) => (
  <LoadingAnimationWrapper>
    <StyledSVG />
    <StyledText margin="0" text={loadingText}></StyledText>
  </LoadingAnimationWrapper>
)

const LoadingAnimationWrapper = styled.div`
  margin: auto;
  text-align: center;
  max-width: 90%;
`

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.07);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
`;

const StyledSVG = styled(baseplus_icon)`
  max-width: 40px;
  animation: ${pulse} 1.4s ease-in-out infinite;
  margin: auto;
  .base_b {
    transform-origin: center;
  }
`

export default LoadingAnimation;