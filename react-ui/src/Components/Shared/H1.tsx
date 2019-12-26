import * as React from 'react';
import styled from 'styled-components';

export interface H1Props {
  text: string;
}
 
const StyledH1: React.SFC<H1Props> = ({text}) => (
  <H1>{text}</H1>
)

const H1 = styled.h1`
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseLightGreen};
  margin-bottom: 10px;
  font-size: 36pt;
  line-height: 0.9;
`

 
export default StyledH1;