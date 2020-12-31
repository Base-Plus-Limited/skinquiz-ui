import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';
import StyledText from './Shared/Text';
import productsIcon from './../Assets/products_icon.jpg';
import leavesIcon from './../Assets/leaves_icon.jpg';
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

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName, baseIngredient, saveBaseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, isQuizCompleted, uniqueId, updateIngredients, selectedSkinConditions, serums, questionsAnswered, areSummaryCTAsVisible, showSummaryCTAs } = useContext(QuizContext);

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

  enum SerumType {
    Allantoin = 5824,
    VitaminC = 5823,
    Emulsion = 5822,
    Pineapple = 5821
  }

  const sortedIngredients = ingredients.filter(x => x.isSelectedForSummary);

  const getProductName = (): string => {
    if(userName)
      return `${userName}'s Bespoke Moisturiser (${sortedIngredients[0].name}, ${sortedIngredients[1].name})`;
    return `Your Bespoke Moisturiser (${sortedIngredients[0].name} & ${sortedIngredients[1].name})`;
  }

  const getNewProduct = () => {
    return {
      name: getProductName(),
      type: 'simple',
      regular_price: getMoisturier().price,
      purchase_note: `Your custom mixture will include ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
      description: '',
      short_description: `Your custom mixture including ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
      categories: [
        {
          id: 21
        }
      ],
      images: [
        {
          src: 'http://baseplus.co.uk/wp-content/uploads/2018/12/productImageDefault.jpg'
        }
      ]
    }
  }

  const amendIngredients = async () => {
    track({
      distinct_id: uniqueId,
      event_type: "Quiz completed - Amend",
      ingredients: `${sortedIngredients[0].name} & ${sortedIngredients[1].name}`,
      amendSelected: true
    }).then(() => {
      const tempProductId = Number(Math.random().toString().split('.')[1].slice(0, 5));
      setQuizToCompleted(true);
      saveQuizToDatabase(tempProductId)
        .then(x => {
          window.location.assign(`https://baseplus.co.uk/customise?productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&username=${userName}&tempproductid=${tempProductId}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer-customise`);
        })
    });
  }

  const sendToWordpress = async () => {
    setQuizToCompleted(true);
    return fetch('/api/new-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(getNewProduct())
    })
    .then(res => res.ok ? res.json() : res.json().then((errorResponse: IErrorResponse) => {
      errorResponse.uiMessage = `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`;
      setApplicationError(errorResponse);
    }))
    .then((product: WordpressProduct) => {
      if (product) {
        Promise.allSettled([
          saveProductToDatabase(product.id),
          saveQuizToDatabase(product.id)
        ])
        .then(result => {
          if(result.some(x => x.status !== "rejected")) {
            window.location.assign(`https://baseplus.co.uk/checkout?add-to-cart=${product.id}&utm_source=skin-quiz&utm_medium=web&utm_campaign=new-customer`)
            return;
          }
          setApplicationError({
            error: true,
            code: 400,
            message: "",
            uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`
          })
        })
      }
    })
    .catch((error: IErrorResponse) => {
      setApplicationError({
        error: true,
        code: error.code,
        message: error.message,
        uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your product`
      })
    });
  }

  const returnCompletedQuizData = (productId: number): ICompletedQuizDBModel => {
    const completedQuiz: ICompletedQuizDBModel = {
      productId: productId,
      quiz: quizQuestions.map(question => (
        {
          questionId: question.id,
          question: question.question,
          answer: question.customAnswer ? question.customAnswer : returnAnswers(question.answers)
        })
      )
    };
    return completedQuiz;
  }

  const returnAnswers = (answers: IAnswer[]) => {
    const selectedAnswers = answers.filter(answer => answer.selected);
    if (selectedAnswers.length === 2)
      return selectedAnswers.map(x => x.value).join(" & ");
    return String(selectedAnswers[0].value);
  }

  const saveQuizToDatabase = (productId: number) => {
    return fetch('/api/save-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(returnCompletedQuizData(productId))
    })
    .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
    .catch(error => {
      setApplicationError({
        error: true,
        code: error.status,
        message: error.message
      })
    });
  }

  const createFinalProductToSaveToDatabase = (productId: number) => {
    const databaseProduct: ICustomProductDBModel = {
      ingredients: sortedIngredients.map(ingredient => {
        return {
          name: ingredient.name,
          id: ingredient.id
        }
      }),
      amended: false,
      productId: productId
    };
    return databaseProduct;
  }

  const saveProductToDatabase = (productId: number) => {
    return track({
      distinct_id: uniqueId,
      event_type: "Quiz completed - Buy Now",
      ingredients: `${sortedIngredients[0].name} & ${sortedIngredients[1].name}`,
      amendSelected: false
    }).then(() => {
      return fetch('/api/save-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(createFinalProductToSaveToDatabase(productId))
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

  const getQuestionAnswer = (questionId: QuestionIds) => {
    const foundQuestion = (quizQuestions.find(question => question.id === questionId) as IQuizQuestion);
    if (foundQuestion.customAnswer.length > 1)
      return foundQuestion.customAnswer;
    const selectedAnswers = foundQuestion.answers.filter(answer => answer.selected);
    return selectedAnswers.length > 1 ?
    getDisplayAnswer(questionId, selectedAnswers.map(answer => answer.value).join(' & ')) :
      getDisplayAnswer(questionId, (selectedAnswers[0].value as string));
  }

  const getDisplayAnswer = (questionId: QuestionIds, answer: string) => {
    const formattedAnswer = answer.toLowerCase().trim();
    if ((questionId === QuestionIds.adverseReactions) && (formattedAnswer === "none"))
      return "Nothing";
    if ((questionId === QuestionIds.exisitingConditions) && (formattedAnswer === "none"))
      return "No skin conditions";
    if (questionId === QuestionIds.fragranceFree)
      return formattedAnswer === "yes" ? "Fragrance-free" : "Fragranced"
    if (questionId === QuestionIds.skinConcernsAndConditions)
      return capitaliseFirstLetter(formattedAnswer);
    if (questionId === QuestionIds.whenYouWakeUpInTheMorning) {
      const condition = SkinConditionEnums[`${selectedSkinConditions[0].index}${selectedSkinConditions[1].index}`];
      return capitaliseFirstLetter(condition);
    }
    return answer;
  }

  const capitaliseFirstLetter = (answer: string) => {
    return answer[0].toUpperCase() + answer.toLowerCase().substring(1);
  }

  const findSerumAndSelectForUpsell = (serumType: SerumType) => {
    return serums
      .filter(x => {
        x.isSelectedForUpsell = x.id === serumType;
        return x.isSelectedForUpsell;
      })[0]
  }

  const getSelectedSerum = () => {
    const skinConcernsAnswer = questionsAnswered
      .filter(x => x.id === QuestionIds.skinConcernsAndConditions)
      .map(a => a.answers.filter(x => x.selected))[0];

    if (isSensitiveSkinAnswerSelected())
      return findSerumAndSelectForUpsell(SerumType.Allantoin);

    if (isAcneAnswerSelected())
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.Oily, SkinConditonAnswers.FeelsDry))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.Oily, SkinConditonAnswers.ScarringAndBlemishes))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.Oily, SkinConditonAnswers.UnevenAndPigmentation))
      return findSerumAndSelectForUpsell(SerumType.Pineapple);


    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.LooksDry, SkinConditonAnswers.FeelsDry))
      return findSerumAndSelectForUpsell(SerumType.Emulsion);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.LooksDry, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.Emulsion);

    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.UnevenAndPigmentation, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.Oily, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.ScarringAndBlemishes, SkinConditonAnswers.UnevenAndPigmentation))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);
    if (areAnswersSelected(skinConcernsAnswer[0], SkinConditonAnswers.ScarringAndBlemishes, SkinConditonAnswers.DullOrBrightening))
      return findSerumAndSelectForUpsell(SerumType.VitaminC);

    return findSerumAndSelectForUpsell(SerumType.Allantoin);
  }

  const areAnswersSelected = (answer: IAnswer, answerIdOne: string, answerIdTwo: string) => {
    return ((answer.value as String).toLowerCase().includes(answerIdOne)) &&
      ((answer.value as String).toLowerCase().includes(answerIdTwo));
  }

  const isAcneAnswerSelected = () => {
    return questionsAnswered
      .filter(x => x.id === QuestionIds.skinConcernsAndConditions)
      .map(question => question.answers.filter(x => x.selected))[0]
      .some(x => x.value.includes("acne"))
  }

  const isSensitiveSkinAnswerSelected = () => {
    return questionsAnswered
      .filter(x => x.id === QuestionIds.sensitiveSkin)
      .map(question => question.answers.filter(x => x.selected))[0]
      .some(x => x.value.includes("Yes") || x.value.includes("Sometimes"));
  }

  const getMoisturier = () => {
    const totalMoisturiserPrice = sortedIngredients
      .filter(x => x.isSelectedForSummary)
      .map(x => Number(x.price))
      .reduce((a, c) => a + c, Number(baseIngredient.regular_price))
    baseIngredient.price = `${totalMoisturiserPrice}`;
    return baseIngredient;
  }

  return (
    <React.Fragment>
      {
        !isQuizCompleted ?
          <LoadingAnimation
            loadingText={`Thank you${userName ? ` ${userName}` : ''}, please wait whilst we create your personalised products`}
          />
        :
        <SummaryWrap>
          <SummaryMixtureWrap>
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
                product={getMoisturier()}
                mixture={sortedIngredients.map(i => i.name).join(" & ")}
                totalPrice={getMoisturier().price}
              >
              </StyledSummaryProduct>
            </ProductsWrap>
            {/* <CallToActionWrapper className={areSummaryCTAsVisible ? "slideUp" : ""}>
              <StyledSummaryButton onClick={sendToWordpress}>
                buy now
              </StyledSummaryButton>
              <StyledSummaryButton onClick={amendIngredients}>
                change
              </StyledSummaryButton>
            </CallToActionWrapper> */}
          </SummaryMixtureWrap>
          {/* <USPs>
            <p>fragrance <span>free option</span></p>
            <div className="circle"></div>
            <p>organic <span>ingredients</span></p>
            <div className="circle"></div>
            <p>cruelty <span>free</span></p>
          </USPs> */}
        </SummaryWrap>
      }
    </React.Fragment>
  )
}

const CallToActionWrapper = styled.div`
  position: fixed;
  bottom: 0;
  margin: 0 auto;
  width: 100%;
  display: flex;
  transform: translateY(100%);
  transition: all 0.25s ease-in-out;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
    max-width: 375px;
    position: static;
    transform: translateY(0);
    margin: 40px auto 20px;
  }
`


const SummaryWhatWeLearntWrap = styled.div`
  width: 100%;
  max-width: 1024px;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-rows: auto auto;
    order: 1;
    margin-bottom: 60px;
  }
`

const ProductsWrap = styled.div`
  @media screen and (min-width: 768px) {
    grid-row: 2;
    width: 100%;
    display: flex;
    align-items: baseline;
  }
`

const SummaryMixtureWrap = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1024px;
  width: 100%;
  margin-bottom: 60px;
  .slideUp {
    transform: translateY(0);
  }
  @media screen and (min-width: 768px) {
    margin-bottom: 40px;
    display: grid;
    order: 3
    grid-template-rows: auto auto;
  }
`

const SummaryWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;
  text-align: center;
  padding-top: 20px;
`

export default StyledSummary;