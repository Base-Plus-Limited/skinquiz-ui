import * as React from 'react';
import { ReactComponent as baseplus_icon } from './../../Assets/bplus_icon.svg';
import styled, { keyframes } from 'styled-components';

export interface LoadingAnimationProps {

}

const LoadingAnimation: React.SFC<LoadingAnimationProps> = () => (
  <StyledSVG />
)

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