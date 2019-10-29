import * as React from 'react';
import styled from 'styled-components';

export interface TextProps {
  text: string;
  margin?: string;
}
 
const StyledText: React.SFC<TextProps> = ({text, margin}) => (
  <Text style={{margin: margin}}>{text}</Text>
)

const Text = styled.p`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.bodyFont};
`

 
export default StyledText;