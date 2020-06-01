import * as React from 'react';
import styled from 'styled-components';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  isWelcomeScreen?: boolean;
}
 
const StyledImage: React.SFC<ImageProps> = ({alt, src, width}) => (
  <Image isWelcomeScreen width={width} src={src} alt={alt}></Image>
)
 
const Image = styled.img`
  max-width: ${(props: ImageProps) => props.isWelcomeScreen ? '95%' : '100%'};
`;

export default StyledImage;