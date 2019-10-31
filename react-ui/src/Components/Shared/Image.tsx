import * as React from 'react';
import styled from 'styled-components';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  isWelcomeScreen?: boolean;
  isSummaryScreen?: boolean;
}
 
const StyledImage: React.SFC<ImageProps> = ({alt, src, width, isSummaryScreen}) => (
  <Image isSummaryScreen={isSummaryScreen} isWelcomeScreen width={width} src={src} alt={alt}></Image>
)
 
const Image = styled.img`
  max-width: ${(props: ImageProps) => props.isWelcomeScreen ? '95%' : '100%'};
  ${props => props.isSummaryScreen && `
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -7.5px;
    margin-left: -7.5px;
  `}
`;

export default StyledImage;