import * as React from 'react';
import styled from 'styled-components';

export interface HRProps {
}
 
const StyledHR: React.SFC<HRProps> = () => (
  <HR></HR>
)

const HR = styled.hr`
  width: 100%;
  max-width: 260px;
  margin: 20px auto;
  display: block;
  padding: 0;
  opacity: 0.2;
  border: none;
  border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
`

 
export default StyledHR;