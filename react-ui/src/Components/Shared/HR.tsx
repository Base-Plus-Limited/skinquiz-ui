import * as React from 'react';
import styled from 'styled-components';

export interface HRProps {
  width: string;
}
 
const StyledHR: React.SFC<HRProps> = ({ width }) => (
  <HR width={width}></HR>
)

const HR = styled.hr`
  width: ${(props: HRProps) => props.width};
  margin: 20px auto;
  display: block;
  padding: 0;
  opacity: 0.2;
  border: none;
  border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
`

 
export default StyledHR;