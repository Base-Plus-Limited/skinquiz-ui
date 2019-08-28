import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface InputProps {
  type: string;
  placeholderText: string;
  logName?: (event: ChangeEvent<HTMLInputElement>) => void;
}
 
const StyledInput: React.SFC<InputProps> = ({type, placeholderText, logName}) => (
  <Input onChange={logName} type={type} placeholder={placeholderText}></Input>
)
 
const Input = styled.input`
  width:100%;
  max-width:90%;
  border: none;
  text-align: center;
  padding: 5px 0;
  outline: none;
  background: none;
  font-size: 11pt;
  border-radius: none;
  margin: 0 auto 20px auto;
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  border-bottom: solid 2px ${props => props.theme.brandColours.baseDarkGreen};
`;

export default StyledInput;