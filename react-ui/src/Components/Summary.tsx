import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import StyledText from './Shared/Text';
import productsIcon from './../Assets/products_icon.jpg';
import tubeIcon from './../Assets/tube_icon.jpg';
import { WordpressProduct, IIngredient, ISerum } from '../Interfaces/WordpressProduct';
import { IAnswer, IQuizQuestion } from '../Interfaces/QuizQuestion';
import { ICompletedQuizDBModel } from '../Interfaces/CompletedQuizDBModel';
import LoadingAnimation from './Shared/LoadingAnimation';
import { IErrorResponse } from '../Interfaces/ErrorResponse';
import ICustomProductDBModel from '../Interfaces/CustomProduct';
import { track } from './Shared/Analytics';
import { ISkinConcernsAndIngredients } from '../Interfaces/SkinConcernsAndIngredients';
import StyledSummaryIngredient from './SummaryProduct';
import StyledSummaryTitle from './SummaryTitle';
import StyledSummaryQuestion from './SummaryQuestion';
import SkinConditionEnums from '../SkinConditons';
import StyledSummaryProduct from './SummaryProduct';
import { SkinConditonAnswers } from '../Interfaces/WordpressQuestion';
import SummaryCart from './SummaryCart';
import { saveQuizToDatabase } from './Shared/QuizHelpers';
import { SerumType } from '../Interfaces/SerumTypes';

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { cartData, isLoading, ingredients, userName, baseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, isQuizCompleted, uniqueId, updateIngredients, serums, questionsAnswered, updateBaseIngredient } = useContext(QuizContext);

  useEffect(() => {
    rankIngredients();
    setQuizToCompleted(true);
  }, [])

  enum SpecialCaseProducts {
    LemonSeedOil = 697,
    TeaTreeOil = 2054,
    Niacinamide = 698,
    VitaminC = 694
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
    track({
      distinct_id: uniqueId,
      event_type: "Quiz completed - Amend",
      variation: `${sortedIngredients[0].name} & ${sortedIngredients[1].name}`,
      amendSelected: true
    }).then(() => {
      const tempProductId = Number(Math.random().toString().split('.')[1].slice(0, 5));
      saveQuizToDatabase(tempProductId, setApplicationError, quizQuestions)
        .then(x => {
          window.location.assign(`https://baseplus.co.uk/customise?productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&username=${userName}&tempproductid=${tempProductId}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer-customise`);
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


    let updatedIngredientList: IIngredient[] = ingredients;

    if (filteredAnswers.some(x => x.toLowerCase() === 'lemon oil'))
      updatedIngredientList = updatedIngredientList.filter(x => x.id !== SpecialCaseProducts.LemonSeedOil);

    if (filteredAnswers.some(x => x.toLowerCase() === 'sensitive'))
      updatedIngredientList = updatedIngredientList
        .filter(x => x.id !== SpecialCaseProducts.LemonSeedOil)
        .filter(x => x.id !== SpecialCaseProducts.TeaTreeOil);


    updatedIngredientList.forEach(ingredient => {
      filteredAnswers.forEach(a => {
        ingredient.tags.forEach(tag => {
          if (tag.name === a)
            ingredient.rank = ingredient.rank + 1;
        })
      })
    })
    updateIngredients(processIngredientsForSelection(updatedIngredientList, skinConcernAnswers));
  }

  const processIngredientsForSelection = (rankedIngredients: IIngredient[], skinConcerns: string[]) => {
    const categorisedIngredients = populateSkinConcernsAndIngredients(rankedIngredients, skinConcerns);
    categorisedIngredients.ingredientsOne = getHighestRankedIngredients(categorisedIngredients.ingredientsOne);
    categorisedIngredients.ingredientsTwo = getHighestRankedIngredients(removeIngredientIfInSecondList(categorisedIngredients.ingredientsOne[0].id, categorisedIngredients.ingredientsTwo));

    let ingredientOne: IIngredient;
    let ingredientTwo: IIngredient;

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
    return selectIngredientsForSummaryScreen(rankedIngredients, ingredientOne, ingredientTwo);
  }

  const filterSpecialCaseIngredient = (ingredientOne: IIngredient, categorisedIngredients: ISkinConcernsAndIngredients) => {
    if ((ingredientOne.id === SpecialCaseProducts.Niacinamide))
      categorisedIngredients.ingredientsTwo = categorisedIngredients.ingredientsTwo.filter(ingredient => ingredient.id !== SpecialCaseProducts.Niacinamide)
    if ((ingredientOne.id === SpecialCaseProducts.VitaminC))
      categorisedIngredients.ingredientsTwo = categorisedIngredients.ingredientsTwo.filter(ingredient => ingredient.id !== SpecialCaseProducts.VitaminC)
    return categorisedIngredients.ingredientsTwo;
  }

  const returnRandomIndex = (ingredients: IIngredient[]) => {
    return Math.floor(Math.random() * Math.floor(ingredients.length));
  }

  const selectIngredientsForSummaryScreen = (rankedIngredients: IIngredient[], ingredientOne: IIngredient, ingredientTwo: IIngredient) => {
    return rankedIngredients.map(ingredient => {
      if (ingredient.id === ingredientOne.id)
        ingredient.isSelectedForSummary = ingredient.id === ingredientOne.id;
      if (ingredient.id === ingredientTwo.id)
        ingredient.isSelectedForSummary = ingredient.id === ingredientTwo.id;
      return ingredient;
    });
  }

  const populateSkinConcernsAndIngredients = (rankedIngredients: IIngredient[], skinConcerns: string[]) => {
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

  const doTagsMatchSkinConcern = (ingredient: IIngredient, skinConcern: string) => {
    return ingredient.tags.some(tag => tag.name.toLowerCase() === skinConcern);
  }

  const removeIngredientIfInSecondList = (id: number, ingredientListTwo: IIngredient[]) => {
    return ingredientListTwo.filter(x => x.id !== id);
  }

  const getHighestRankedIngredients = (ingredients: IIngredient[]) => {
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
    updateMoisturiserPrice();
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

  const updateMoisturiserPrice = () => {
    baseIngredient.price = String(sortedIngredients
      .filter(x => x.isSelectedForSummary)
      .map(x => Number(x.price))
      .reduce((a, c) => a + c, Number(baseIngredient.regular_price)))
    updateBaseIngredient(baseIngredient);
  }

  const formatAnswersToLowercase = (answers: string | string[]) => {
    if (Array.isArray(answers)) {
      return (answers as string[]).map(x => x.toLowerCase());
    } else {
      return (answers as string).toLowerCase();
    }
  } 

  const getLoadingProductType = () => {
    if (cartData.length === 1) {
      if (cartData.some(d => d.productType === "serum"))
        return "serum"
      if (cartData.some(d => d.productType === "moisturiser"))
        return "moisturiser"
    } else if (cartData.length === 2) {
      return "bundle"
    } else {
      return ""
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
                product={getSelectedSerum()}
              >
              </StyledSummaryProduct>
              <StyledSummaryProduct
                product={baseIngredient}
                ingredients={sortedIngredients}
                clickHandler={amendIngredients}
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
    height: calc(100% - 99px);
  }
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 260px 260px;
    align-items: end;
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