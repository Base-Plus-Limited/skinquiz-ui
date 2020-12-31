import React, { useContext } from 'react';
// import styled from 'styled-components';

// import StyledH2 from '../Components/Shared/H2';
// import StyledUpsellMoisturiser from '../Components/UpsellMoisturiser';
// import StyledUpsellSerum from '../Components/UpsellSerum';
// import { QuizContext } from '../QuizContext';

// export interface UpsellProps {
// }

// const StyledUpsell: React.FC<UpsellProps> = () => {


//   const { productType, isLoading } = useContext(QuizContext);

//   const getProductTypeName = () => productType === IProductType.SERUM ? "Moisturiser" : "'Good Skin' Serum";

//   return (
//     <Upsell>
//       {
//         !isLoading &&
//           <StyledH2 isUpsellHeading={true} text={`Based on your quiz, we've also personalised a ${getProductTypeName()} for you`}>
//           </StyledH2>
//       }
//       {
//         // productType === IProductType.SERUM ?
//         //   <StyledUpsellMoisturiser></StyledUpsellMoisturiser>
//         //   :
//         //   <StyledUpsellSerum></StyledUpsellSerum>
//       }
//     </Upsell>
//   );
// }

// const Upsell = styled.div`
//   transition: all ease 0.45s;
//   padding: 30px 0 80px;
//   .upsellHeading {
//     max-width: 90%;
//     width: 100%;
//     margin: 0 auto;
//     text-align: center;
//     line-height: 1.2em;
//   }
// `


// export default StyledUpsell;