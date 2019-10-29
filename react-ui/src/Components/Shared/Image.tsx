import * as React from 'react';
import styled from 'styled-components';

export interface ImageProps {
  src: string;
  alt: string;
  position?: string;
  width?: number;
  isWelcomeScreen?: boolean;
  isSummaryScreen?: boolean;
}
 
const StyledImage: React.SFC<ImageProps> = ({alt, src, width, isSummaryScreen}) => (
  <Image isSummaryScreen={isSummaryScreen} isWelcomeScreen width={width} src={src} alt={alt}></Image>
)
 
const Image = styled.img`
  max-width: ${(props: ImageProps) => props.isWelcomeScreen ? '95%' : '100%'};
  position: ${(props: ImageProps) => props.isSummaryScreen ? 'absolute' : ''};
  top: ${(props: ImageProps) => props.isSummaryScreen ? '50%' : ''};
  left: ${(props: ImageProps) => props.isSummaryScreen ? '50%' : ''};
  margin-top: ${(props: ImageProps) => props.isSummaryScreen ? '-7.5px' : ''};
  margin-left: ${(props: ImageProps) => props.isSummaryScreen ? '-7.5px' : ''};
`;

export default StyledImage;