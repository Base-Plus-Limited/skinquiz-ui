import * as React from 'react';
import styled from 'styled-components';

export interface TextProps {
  text: string;
}
 
const StyledText: React.SFC<TextProps> = ({text}) => (
  <Text>{text}</Text>
)

const Text = styled.p`
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.bodyFont};
`

 
export default StyledText;