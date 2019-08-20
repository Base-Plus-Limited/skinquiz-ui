import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';

export interface FooterProps {
}

const StyledFooter: React.FC<FooterProps> = () => {

  const { progressCount } = useContext(QuizContext);
  
  return (
    <Footer>
      <span>
        {progressCount}/4
      </span>
    </Footer>
  );
}

const Footer = styled.footer`
  border-top: solid 1px ${props => props.theme.brandColours.baseLightGreen};
  text-align: center;
  width: 100%;
  background: #fff;
  padding: 20px 0;
`

export default StyledFooter;