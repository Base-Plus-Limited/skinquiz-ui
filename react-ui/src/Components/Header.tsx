import * as React from 'react';
import styled from 'styled-components';
import logo from './../Assets/base_light_green.png';
import StyledLink from './Shared/Link';
import StyledImage from './Shared/Image';

export interface HeaderProps {
}
 
const StyledHeader: React.FC<HeaderProps> = () => {

  return <Header>
    <StyledLink href={"/"}>
      <StyledImage src={logo} width={90} alt={"base plus"}></StyledImage>
    </StyledLink>
    <StyledLink href={"/"}>
      home icon
    </StyledLink>
  </Header>

}

const Header = styled.header`
  border-bottom: solid 2px ${props => props.theme.brandColours.baseLightGreen};
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
`;

export default StyledHeader;