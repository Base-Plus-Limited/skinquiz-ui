import * as React from 'react';
import styled from 'styled-components';

export interface H2Props {
  text: string;
}
 
const StyledH2: React.SFC<H2Props> = ({text}) => (
  <H2>{text}</H2>
)

const H2 = styled.h2`
  font-family: ${props => props.theme.subHeadingFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  margin: 7px 0 27px;
  font-size: 15pt;
  line-height: 0.9;
`

 
export default StyledH2;