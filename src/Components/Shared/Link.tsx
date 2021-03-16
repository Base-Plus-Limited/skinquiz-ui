import * as React from 'react';
import styled from 'styled-components';

export interface LinkProps {
  href: string;
}
 
const StyledLink: React.SFC<LinkProps> = ({children, href}) => (
  <Link href={href}>{children}</Link>
)
 
const Link = styled.a`
  display: block; 
`;

export default StyledLink;