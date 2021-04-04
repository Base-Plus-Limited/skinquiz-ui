import React from 'react';
import styled from 'styled-components';

export interface PromptProps {
  prompt: string | string[];
  noMargin?: boolean;
}
 
const StyledPrompt: React.FC<PromptProps> = ({ prompt }: PromptProps) => (
  <Prompt>
    {prompt}
  </Prompt>
)

const Prompt = styled.span`
  margin: ${(props: any) => props.noMargin ? "0" : "4px 0 22px"};
  font-size: 9pt;
  display: inline-block;
  font-weight: 400;
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
`
 
export default StyledPrompt;