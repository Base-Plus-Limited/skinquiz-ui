import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface InputProps {
  type: string;
  placeholderText?: string;
  logInputValue?: (event: ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}
 
const StyledInput: React.SFC<InputProps> = ({type, placeholderText, logInputValue, width}) => (
  <Input width={width} onChange={logInputValue} type={type} placeholder={placeholderText}></Input>
)
 
const Input = styled.input`
  width: ${(props: InputProps) => props.width ? props.width : "100%"};
  max-width:90%;
  border: none;
  text-align: center;
  padding: 5px 0;
  outline: none;
  background: none;
  font-size: 11pt;
  border-radius: none;
  display: block;
  margin: 0 auto 20px auto;
  font-family: ${props => props.theme.bodyFont};
  color: ${props => props.theme.brandColours.baseDarkGreen};
  border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
`;

export default StyledInput;