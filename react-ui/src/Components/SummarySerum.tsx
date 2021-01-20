import React from 'react';
import styled from 'styled-components';
import { ISerum } from '../Interfaces/WordpressProduct';

export interface SummarySerumProps {
  serum: ISerum;
}
 
const StyledSummarySerum: React.FC<SummarySerumProps> = ({ serum }: SummarySerumProps) => {
  return (
    <Serum>
      <img src={serum.images[0].src} alt={`${serum.name} image`}/>
      <p className="name">{serum.name}<span className="price">£{serum.price}</span></p>
      <p className="desc">{serum.short_description}</p>
    </Serum> 
  )
}

const Serum = styled.div`
  text-align: center;
  margin: 0 auto 0;
  max-width: 90%;
  img{
    margin: 0 auto 10px;
    display: block;
    max-width: 100px;
  }
  .name {
    text-transform: uppercase;
    font-size: 9pt;
    margin: 0 0 5px;
    border-left: ${props => props.theme.brandColours.baseDarkGreen};
    font-family: ${props => props.theme.subHeadingFont};
  }
  .price {
    border-left: solid 2px ${props => props.theme.brandColours.baseDefaultGreen};
    padding: 0 0 0 8px;
    margin: 0 0 0 8px;
    color: ${props => props.theme.brandColours.baseDefaultGreen};
  }
  .desc {
    color: ${props => props.theme.brandColours.baseDarkGreen};
    font-family: ${props => props.theme.bodyFont};
    margin: 0 0 10px 0;
    font-size: 9pt;
    line-height: 1.4em;
  }
  @media screen and (min-width: 768px) {
    max-width: 276px;
  }
`
 
export default StyledSummarySerum;