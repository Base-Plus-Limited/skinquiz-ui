import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import productsIcon from './../Assets/products_icon.jpg';
import { IShopifyUIProduct } from '../Interfaces/ShopifyProduct';
import { IAnswer } from '../Interfaces/QuizQuestion';
import LoadingAnimation from './Shared/LoadingAnimation';
import { track } from './Shared/Analytics';
import { ISkinConcernsAndIngredients } from '../Interfaces/SkinConcernsAndIngredients';
import StyledSummaryTitle from './SummaryTitle';
import StyledSummaryProduct from './SummaryProduct';
import { SkinConditonAnswers } from '../Interfaces/WordpressQuestion';
import SummaryCart from './SummaryCart';
import { saveQuizToDatabase } from './Shared/QuizHelpers';
import { SerumType } from '../Interfaces/SerumTypes';

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { cartData, isLoading, toggleLoading, ingredients, userName, baseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, isQuizCompleted, analyticsId, updateIngredients, serums, longUniqueId, questionsAnswered, updateBaseIngredient, toggleAmendSelected, isAmendSelected, moisturiserSizes } = useContext(QuizContext);

  useEffect(() => {
    rankIngredients();
    setQuizToCompleted(true);
  }, [])

  enum SpecialCaseProducts {
    LemonSeedOil = 6960043065493,
    TeaTreeOil = 6960042147989,
    Niacinamide = 6960042868885,
    VitaminC = 6960043262101
  }

  enum QuestionIds {
    areYouAged = 683,
    whatIsYourGender = 682,
    whatIsYourEthnicity = 708,
    naturalSkinTone = 716,
    whenYouWakeUpInTheMorning = 1443,
    skinConcernsAndConditions = 706,
    sensitiveSkin = 715,
    adverseReactions = 712,
    exisitingConditions = 1659,
    fragranceFree = 3870
  }

  const sortedIngredients = ingredients.filter(x => x.isSelectedForSummary);

  const amendIngredients = async () => {
    toggleLoading(true);
    toggleAmendSelected(true);
    const foundSerum = cartData.find(d => d.productType === "serum");
    track({
      distinct_id: analyticsId,
      event_type: "Quiz completed - Change Ingredients",
      variation: `${sortedIngredients[0].title} & ${sortedIngredients[1].title}`,
      amendSelected: true
    }).then(() => {
      saveQuizToDatabase(longUniqueId, setApplicationError, quizQuestions)
        .then(_ => {
          const selectedMoisturiser = getSelectedMoisturiser();
          if (foundSerum) {
            window.location.assign(`https://baseplus.co.uk/customise?add-to-cart=${foundSerum.id}&productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&size=${selectedMoisturiser && selectedMoisturiser.size}&username=${userName}&longuniqueid=${longUniqueId}&analyticsid=${analyticsId}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer-customise`);
          } else {
            window.location.assign(`https://baseplus.co.uk/customise?productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&size=${selectedMoisturiser && selectedMoisturiser.size}&username=${userName}&longuniqueid=${longUniqueId}&analyticsid=${analyticsId}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer-customise`);
          }
        })
    });
  }
  
  const rankIngredients = () => {
    const skinConcernAnswers: string[] = [];
    const answers = quizQuestions.map(q => {
      if (q.id === QuestionIds.skinConcernsAndConditions) {
        const selected = (q.answers.map((a, i) => {
          if (a.selected)
            return a.meta[i];
        }) as string[]).filter(x => x !== undefined);
        skinConcernAnswers.push(...selected);
        return;
      }
      const index = q.answers.findIndex(x => x.selected);
      return q.answers[index].meta[index];
    });
    answers.push(...skinConcernAnswers);
    const filteredAnswers = (answers.filter(x => x !== undefined)) as string[];


    let updatedIngredientList: IShopifyUIProduct[] = ingredients;

    if (filteredAnswers.some(x => x.toLowerCase() === 'lemon oil'))
      updatedIngredientList = updatedIngredientList.filter(x => x.id !== SpecialCaseProducts.LemonSeedOil);

    if (filteredAnswers.some(x => x.toLowerCase() === 'sensitive'))
      updatedIngredientList = updatedIngredientList
        .filter(x => x.id !== SpecialCaseProducts.LemonSeedOil)
        .filter(x => x.id !== SpecialCaseProducts.TeaTreeOil);


    updatedIngredientList.forEach(ingredient => {
      filteredAnswers.forEach(a => {
        ingredient.tags_as_array.forEach(tag => {
          if (tag === a)
            ingredient.rank = ingredient.rank + 1;
        })
      })
    })
    updateIngredients(processIngredientsForSelection(updatedIngredientList, skinConcernAnswers));
  }

  const processIngredientsForSelection = (rankedIngredients: IShopifyUIProduct[], skinConcerns: string[]) => {
    const categorisedIngredients = populateSkinConcernsAndIngredients(rankedIngredients, skinConcerns);
    categorisedIngredients.ingredientsOne = getHighestRankedIngredients(categorisedIngredients.ingredientsOne);
    categorisedIngredients.ingredientsTwo = getHighestRankedIngredients(removeIngredientIfInSecondList(categorisedIngredients.ingredientsOne[0].id, categorisedIngredients.ingredientsTwo));

    let ingredientOne: IShopifyUIProduct;
    let ingredientTwo: IShopifyUIProduct;

    categorisedIngredients.ingredientsOne.length > 1 ?
      ingredientOne = categorisedIngredients.ingredientsOne[returnRandomIndex(categorisedIngredients.ingredientsOne)] :
      ingredientOne = categorisedIngredients.ingredientsOne[0];

    categorisedIngredients.ingredientsTwo = filterSpecialCaseIngredient(ingredientOne, categorisedIngredients);
    if (categorisedIngredients.ingredientsTwo.length > 1) {
      const unselectedIngredients = categorisedIngredients.ingredientsTwo.filter(x => x.id !== ingredientOne.id);
      ingredientTwo = unselectedIngredients[returnRandomIndex(unselectedIngredients)];
    } else {
      ingredientTwo = categorisedIngredients.ingredientsTwo[0];
    }

    if (ingredientOne.id === ingredientTwo.id) {
      const x = categorisedIngredients.ingredientsOne.filter(i => i.id !== ingredientTwo.id);
      ingredientTwo = x[0];
    }

    return selectIngredientsForSummaryScreen(rankedIngredients, ingredientOne, ingredientTwo);
  }

  const filterSpecialCaseIngredient = (ingredientOne: IShopifyUIProduct, categorisedIngredients: ISkinConcernsAndIngredients) => {
    if ((ingredientOne.id === SpecialCaseProducts.Niacinamide) && (categorisedIngredients.ingredientsTwo.length === 1) && (categorisedIngredients.ingredientsOne.length !== 1)) {
      categorisedIngredients.ingredientsTwo = categorisedIngredients.ingredientsOne.filter(x => x.id !== SpecialCaseProducts.Niacinamide);
      return categorisedIngredients.ingredientsTwo;
    }
    if ((ingredientOne.id === SpecialCaseProducts.Niacinamide))
      categorisedIngredients.ingredientsTwo = categorisedIngredients.ingredientsTwo.filter(ingredient => ingredient.id !== SpecialCaseProducts.Niacinamide)
    if ((ingredientOne.id === SpecialCaseProducts.VitaminC))
      categorisedIngredients.ingredientsTwo = categorisedIngredients.ingredientsTwo.filter(ingredient => ingredient.id !== SpecialCaseProducts.VitaminC)
    return categorisedIngredients.ingredientsTwo;
  }

  const returnRandomIndex = (ingredients: IShopifyUIProduct[]) => {
    return Math.floor(Math.random() * Math.floor(ingredients.length));
  }

  const selectIngredientsForSummaryScreen = (rankedIngredients: IShopifyUIProduct[], ingredientOne: IShopifyUIProduct, ingredientTwo: IShopifyUIProduct) => {
    return rankedIngredients.map(ingredient => {
      if (ingredient.id === ingredientOne.id)
        ingredient.isSelectedForSummary = ingredient.id === ingredientOne.id;
      if (ingredient.id === ingredientTwo.id)
        ingredient.isSelectedForSummary = ingredient.id === ingredientTwo.id;
      return ingredient;
    });
  }

  const populateSkinConcernsAndIngredients = (rankedIngredients: IShopifyUIProduct[], skinConcerns: string[]) => {
    const categorisedIngredients: ISkinConcernsAndIngredients = {
      concernOne: "",
      ingredientsOne: [],
      concernTwo: "",
      ingredientsTwo: []
    };
    rankedIngredients.forEach(ingredient => {
      if (doTagsMatchSkinConcern(ingredient, skinConcerns[0])) {
        categorisedIngredients.concernOne = skinConcerns[0];
        categorisedIngredients.ingredientsOne.push(ingredient);
      }
      if (doTagsMatchSkinConcern(ingredient, skinConcerns[1])) {
        categorisedIngredients.concernTwo = skinConcerns[1];
        categorisedIngredients.ingredientsTwo.push(ingredient);
      }
    });
    return categorisedIngredients;
  }

  const doTagsMatchSkinConcern = (ingredient: IShopifyUIProduct, skinConcern: string) => {
    return ingredient.tags_as_array.some(tag => tag.toLowerCase() === skinConcern);
  }

  const removeIngredientIfInSecondList = (id: number, ingredientListTwo: IShopifyUIProduct[]) => {
    return ingredientListTwo.filter(x => x.id !== id);
  }

  const getHighestRankedIngredients = (ingredients: IShopifyUIProduct[]) => {
    const highestRank = Math.max(...ingredients.map(x => x.rank));
    return ingredients.filter(x => x.rank === highestRank);
  }

  const findSerumAndSelectForUpsell = (serumType: SerumType) => {
    return serums
      .filter(x => {
        x.isSelectedForUpsell = x.id === serumType;
        return x.isSelectedForUpsell;
      })[0]
  }

  const getSelectedSerum = () => {
    // updateMoisturiserPrice();
    const skinConcernsAnswer = questionsAnswered
      .filter(x => x.id === QuestionIds.skinConcernsAndConditions)
      .map(a => a.answers.filter(x => x.selected))[0];

    if (isSensitiveSkinAnswerSelected())
      return findSerumAndSelectForUpsell(SerumType.Allantoin);

    if (isAcneAnswerSelected())
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.Oily, SkinConditonAnswers.FeelsDry))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.Oily, SkinConditonAnswers.ScarringAndBlemishes))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.Oily, SkinConditonAnswers.UnevenAndPigmentation))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);


    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.LooksDry, SkinConditonAnswers.FeelsDry))
      return findSerumAndSelectForUpsell(SerumType.Emulsion);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.LooksDry, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.Emulsion);

    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.UnevenAndPigmentation, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.Oily, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.ScarringAndBlemishes, SkinConditonAnswers.UnevenAndPigmentation))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer, SkinConditonAnswers.ScarringAndBlemishes, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);

    return findSerumAndSelectForUpsell(SerumType.Allantoin);
  }

  const areAnswersSelected = (answer: IAnswer[], answerIdOne: string, answerIdTwo: string) => {
    const foundAnswers = [];
    answer.forEach(a => {
      if (((a.value as String).toLowerCase() === answerIdOne))
        foundAnswers.push(a.value)
      if (((a.value as String).toLowerCase() === answerIdTwo))
        foundAnswers.push(a.value)
    })
    return foundAnswers.length === 2;
  }

  const isAcneAnswerSelected = () => {
    return questionsAnswered
      .filter(x => x.id === QuestionIds.skinConcernsAndConditions)
      .map(question => question.answers.filter(x => x.selected))[0]
      .some(x => formatAnswersToLowercase(x.value).includes("acne"))
  }

  const isSensitiveSkinAnswerSelected = () => {
    return questionsAnswered
      .filter(x => x.id === QuestionIds.sensitiveSkin)
      .map(question => question.answers.filter(x => x.selected))[0]
      .some(x => formatAnswersToLowercase(x.value).includes("yes") || formatAnswersToLowercase(x.value).includes("sometimes"));
  }

  const getSelectedMoisturiser = () => moisturiserSizes.find(x => x.selected);

  // const updateMoisturiserPrice = () => {
  //   baseIngredient.variants[0].price = getPrice();
  //   updateBaseIngredient(baseIngredient);
  // }

  // const getPrice = () => {
  //   const selectedMoisturiser = getSelectedMoisturiser();
  //   const ingerdientsPrice = sortedIngredients.map(i => Number(i.variants[0].price)).reduce((a, c) => a + c);
  //   const minus75Percent = ingerdientsPrice * 0.75;
  //   return String(sortedIngredients
  //     .filter(x => x.isSelectedForSummary)
  //     .map(x => Number(x.variants[0].price))
  //     .reduce((a, c) => a + c, Number((selectedMoisturiser && selectedMoisturiser.size) === "50ml" ? baseIngredient.variants[1].price : Number(baseIngredient.variants[0].price) - minus75Percent)))
  // }

  const formatAnswersToLowercase = (answers: string | string[]) => {
    if (Array.isArray(answers)) {
      return (answers as string[]).map(x => x.toLowerCase());
    } else {
      return (answers as string).toLowerCase();
    }
  } 

  const getLoadingProductType = () => {
    if (isAmendSelected) {
      return "product"
    }
    if (cartData.length === 1) {
      if (cartData.some(d => d.productType === "serum"))
        return "serum"
      if (cartData.some(d => d.productType === "moisturiser"))
        return "moisturiser"
    } else if (cartData.length === 2) {
      return "bundle"
    } else {
      return "moisturiser"
    }
  }

  return (
    <React.Fragment>
      {
        ((!isQuizCompleted) || (isLoading)) ?
          <LoadingAnimation
            loadingText={`Thank you${userName ? ` ${userName}` : ''}, please wait whilst we create your personalised ${getLoadingProductType()}`}
          />
        :
        <SummaryWrap>
          <SummaryProducts>
            <StyledSummaryTitle
              heading={`${userName ? ` ${userName}'s personalised products` : 'Your personalised products'}`}
              imageUrl={productsIcon}
              subHeading={"Build your skincare routine"}
            >
            </StyledSummaryTitle>
            <ProductsWrap>
              <StyledSummaryProduct
                product={baseIngredient}
                ingredients={sortedIngredients}
                onAmend={amendIngredients}
              >
              </StyledSummaryProduct>
              <StyledSummaryProduct
                product={getSelectedSerum()}
                ingredients={sortedIngredients}
              >
              </StyledSummaryProduct>
            </ProductsWrap>
          </SummaryProducts>
          <Spacer></Spacer>
          <SummaryCart
            userName={userName}
            sortedIngredients={sortedIngredients}
          >
          </SummaryCart>
        </SummaryWrap>
      }
    </React.Fragment>
  )
}

const Spacer = styled.div`
  display: none;
  width:0;
  border-right: solid 1px rgba(191,191,191,.6);
  height: 70%;
  margin: auto 0; 
  @media screen and (min-width: 768px) {
    display: block;
  }
`


const ProductsWrap = styled.div`
  .moisturiserDescriptionPanel {
    height: calc(100% - 127px);
  }
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 260px 260px;
    align-items: baseline;
    justify-content: space-evenly;
    gap: 20px;
    .moisturiser {
      margin: 0px auto -30px;
    }
  }
  @media screen and (min-width: 980px) {
    gap: 0;
  }
`

const SummaryProducts = styled.div`
`

const SummaryWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  @media screen and (min-width: 980px) {
    padding-top: 0;
    display: grid;
    grid-template-columns: 60% auto 31%;
    width: 930px;
    margin: 0 auto;
    align-items: start;
    gap: 4%;
  }
`

export default StyledSummary;