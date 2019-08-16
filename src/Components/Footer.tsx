import * as React from 'react';
import styled from 'styled-components';

export interface FooterProps {
  progressCount?: number;
}

const StyledFooter: React.FC<FooterProps> = ({ progressCount }: FooterProps) => {
  return (
    <Footer>
      <span>
        {progressCount ? progressCount : 0}
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