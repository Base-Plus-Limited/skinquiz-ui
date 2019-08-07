import * as React from 'react';
import styled from 'styled-components';

export interface ImageProps {
  src: string;
  alt: string;
  position?: string;
  width: number;
}
 
const StyledImage: React.SFC<ImageProps> = ({alt, src, width, position}) => (
  <Image width={width} src={src} alt={alt}></Image>
)
 
const Image = styled.img`
  width: ${props => props.width}px;
  max-width: 100%;
`;

export default StyledImage;