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
  color: ${props => props.theme.brandColours.baseDefaultGreen};
  margin-bottom: 10px;
  font-size: 36pt;
  line-height: 1.1em;
`

 
export default StyledH1;