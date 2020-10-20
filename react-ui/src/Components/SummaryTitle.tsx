import React from 'react';
import styled from 'styled-components';

export interface SummaryTitleProps {
  subHeading: string;
  heading: string;
  imageUrl: string;
}
 
const StyledSummaryTitle: React.FC<SummaryTitleProps> = ({ subHeading, imageUrl, heading }: SummaryTitleProps) => {
  return (
    <Heading>
      <img src={imageUrl} alt=""/>
      <h2>{heading}</h2>
      {subHeading.length > 1 && <p>{subHeading}</p>}
      <hr />
    </Heading> 
  )
}

const Heading = styled.div`
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
  img{
    margin: 30px auto 20px;
    display: block;
    max-width: 60px;
  }
  h2,
  p{
    margin: 0;
    color: ${props => props.theme.brandColours.baseDarkGreen};
  }
  h2{
    font-family: ${props => props.theme.bodyFont};
    font-size: 15pt;
    margin: 0 0 7px 0;
  }
  p{
    font-family: ${props => props.theme.subHeadingFont};
    font-size: 10pt;
    font-weight: normal;
  }
  hr {
    margin: 15px auto 50px;
  }
`
 
export default StyledSummaryTitle;