import * as React from 'react';
import styled from 'styled-components';

export interface SubHeadingProps {
  text: string;
  margin?: string;
  fontSize?: string;
}
 
const StyledSubHeading: React.SFC<SubHeadingProps> = ({text, margin, fontSize}) => (
  <SubHeading style={{margin: margin, fontSize: fontSize}}>{text}</SubHeading>
)

const SubHeading = styled.p`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
`

 
export default StyledSubHeading;