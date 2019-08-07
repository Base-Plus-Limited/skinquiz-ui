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

  border-top: solid 1px ${props => props.theme.brandColours.lightGreen};
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 20px 0;
`

export default StyledFooter;