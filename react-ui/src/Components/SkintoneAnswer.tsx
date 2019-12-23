import React from 'react';
import Tick from './Tick';
import styled from 'styled-components';

export interface SkintoneAnswerProps {
  value: string | string[];
  skinColour: string;
  selected: boolean;
  selectAnswer: () => void;
}
 
const StyledSkintoneAnswer: React.FC<SkintoneAnswerProps> = ({ value, selectAnswer, selected, skinColour }: SkintoneAnswerProps) => {
  return <SkintoneAnswer onClick={selectAnswer}>
    {<SkintoneSquare style={{ background: `${skinColour}` }}>
      {selected && <Tick tickPadding={"2px 6px 3px"}></Tick>}
    </SkintoneSquare>}
    {
      value.length ? 
      <SkintoneText>
        {value[0]} <br/>
        <SkintoneSubText>{value[1]}</SkintoneSubText> 
      </SkintoneText>
      : 
      <SkintoneText>
        {value}
      </SkintoneText>
    }
  </SkintoneAnswer>
}

const SkintoneSubText = styled.span`
  font-size: 8pt;
  margin: 1px 0 7px 0;
  text-transform: initial;
  display: block;
`

const SkintoneText = styled.p`
  margin: 0;
  font-size: 9pt;
`

const SkintoneSquare = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  position: relative;
`

const SkintoneAnswer = styled.div`
  display: none;
  margin: auto;
  cursor: pointer;
  display: inline-block;
  width: 180px;
  text-transform: uppercase;
  color: ${props => props.theme.brandColours.baseDarkGreen};
  font-family: ${props => props.theme.subHeadingFont};
  font-weight: 600;
  @media screen and (min-width: 768px) {
    margin: 4px;
  }
`
 
export default StyledSkintoneAnswer;