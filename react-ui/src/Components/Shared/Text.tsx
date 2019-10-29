import * as React from 'react';
import styled from 'styled-components';

export interface TextProps {
  text: string;
  margin?: string;
  fontSize?: string;
}
 
const StyledText: React.SFC<TextProps> = ({text, margin, fontSize}) => (
  <Text style={{margin: margin, fontSize: fontSize}}>{text}</Text>
)

const Text = styled.p`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.bodyFont};
`

 
export default StyledText;