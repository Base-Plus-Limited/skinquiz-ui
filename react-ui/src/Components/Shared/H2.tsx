import * as React from 'react';
import styled from 'styled-components';

export interface H2Props {
  text: string;
  margin?: string;
}
 
const StyledH2: React.SFC<H2Props> = ({text, margin}) => (
  <H2 style={{margin: margin && "7px 0 27px"}}>{text}</H2>
)

const H2 = styled.h2`
  font-family: ${props => props.theme.subHeadingFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-size: 15pt;
  line-height: 0.9;
`

 
export default StyledH2;