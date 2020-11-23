import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';
import StyledText from './Shared/Text';
import productsIcon from './../Assets/products_icon.jpg';
import leavesIcon from './../Assets/leaves_icon.jpg';
import tubeIcon from './../Assets/tube_icon.jpg';
import { WordpressProduct, IIngredient } from '../Interfaces/WordpressProduct';
import { IAnswer, IQuizQuestion } from '../Interfaces/QuizQuestion';
import { ICompletedQuizDBModel } from '../Interfaces/CompletedQuizDBModel';
import LoadingAnimation from './Shared/LoadingAnimation';
import { IErrorResponse } from '../Interfaces/ErrorResponse';
import ICustomProductDBModel from '../Interfaces/CustomProduct';
import { track } from './Shared/Analytics';
import { ISkinConcernsAndIngredients } from '../Interfaces/SkinConcernsAndIngredients';
import StyledSummaryIngredient from './SummaryIngredient';
import StyledSummaryTitle from './SummaryTitle';
import StyledSummaryQuestion from './SummaryQuestion';
import SkinConditionEnums from '../SkinConditons';

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName, baseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, isQuizCompleted, uniqueId, updateIngredients, selectedSkinConditions, questionsAnswered, areSummaryCTAsVisible, showSummaryCTAs } = useContext(QuizContext);

  useEffect(() => {
    rankIngredients();
  }, []);

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

  const getProductName = (): string => {
    if(userName)
      return `${userName}'s Bespoke Product`;
    return `Your Bespoke Product`;
  }

  const getTotalPrice = () => {
    const total = Number(sortedIngredients[0].price) + Number(sortedIngredients[1].price) + Number(baseIngredient.price);
    return total.toFixed(2);
  }

  const getNewProduct = () => {
    return {
      name: getProductName(),
      type: 'simple',
      regular_price: getTotalPrice(),
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
      const tempProductId = generateTempProductId();
      setQuizToCompleted(true);
      saveQuizToDatabase(tempProductId)
        .then(x => {
          window.location.assign(`https://baseplus.co.uk/customise?productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&username=${userName}&tempproductid=${tempProductId}`);
        })
    });
  }

  const generateTempProductId = () => {
    return Number(Math.random().toString().split('.')[1].slice(0,5));
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
            window.location.assign(`https://baseplus.co.uk/cart?add-to-cart=${product.id}`)
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
      if (q.id === 706) {
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

  return (
    <React.Fragment>
      {
        isQuizCompleted ?
        <LoadingAnimationWrapper>
          <LoadingAnimation />
          <StyledText margin="0" text={`Thank you${userName ? ` ${userName}` : ''}, please wait whilst we create your personalised moisturiser`}></StyledText>
        </LoadingAnimationWrapper>
        :
        <SummaryWrap>
          <SummaryMixtureWrap>
            <StyledSummaryTitle
              heading={"Your Recipe"}
              imageUrl={leavesIcon}
              subHeading={"personalised by you, formulated by us"}
            >
            </StyledSummaryTitle>
            <Mixture>
              {
                sortedIngredients.map((ingredient) => (
                  <React.Fragment>
                    <StyledSummaryIngredient
                      key={ingredient.id}
                      name={ingredient.name}
                      description={ingredient.short_description}
                      price={ingredient.price}
                      usedFor={ingredient.commonlyUsedFor}
                      imageUrl={ingredient.images[0].src}
                    >
                    </StyledSummaryIngredient>
                    <hr />
                  </React.Fragment>
                ))
              }
              <StyledSummaryIngredient
                key={baseIngredient.id}
                name={baseIngredient.name}
                description={baseIngredient.short_description}
                price={baseIngredient.price}
                usedFor={baseIngredient.commonlyUsedFor}
                imageUrl={baseIngredient.images[0].src}
              >
              </StyledSummaryIngredient>
            </Mixture>
            <CallToActionWrapper className={areSummaryCTAsVisible ? "slideUp" : ""}>
              <StyledSummaryButton onClick={sendToWordpress}>
                buy now
              </StyledSummaryButton>
              <StyledSummaryButton onClick={amendIngredients}>
                change
              </StyledSummaryButton>
            </CallToActionWrapper>
          </SummaryMixtureWrap>
          <SummaryWhatWeLearntWrap>
            <StyledSummaryTitle
              heading={`Here’s a few things we learnt about you${userName ? ", " + userName : ""}`}
              imageUrl={productsIcon}
              subHeading={""}
            >
            </StyledSummaryTitle>
            <QuestionsAndAnswers>
              <StyledSummaryQuestion
                answer={getQuestionAnswer(QuestionIds.whenYouWakeUpInTheMorning)}
                questionText="Your skin type is:"
              >
              </StyledSummaryQuestion>
              <StyledSummaryQuestion
                answer={getQuestionAnswer(QuestionIds.fragranceFree)}
                questionText="You would like your moisturiser:"
              ></StyledSummaryQuestion>
              <StyledSummaryQuestion
                answer={getQuestionAnswer(QuestionIds.exisitingConditions)}
                questionText="You currently experience:"
              >
              </StyledSummaryQuestion>
            </QuestionsAndAnswers>
          </SummaryWhatWeLearntWrap>
          <USPs>
            <p>fragrance <span>free option</span></p>
            <div className="circle"></div>
            <p>organic <span>ingredients</span></p>
            <div className="circle"></div>
            <p>cruelty <span>free</span></p>
          </USPs>
          <SummaryWhatWeAlsoKnowWrap>
            <StyledSummaryTitle
              heading={"We also know that..."}
              imageUrl={tubeIcon}
              subHeading={""}
            >
            </StyledSummaryTitle>
            <QuestionsAndAnswers>
              <StyledSummaryQuestion
                answer={getQuestionAnswer(QuestionIds.skinConcernsAndConditions)}
                questionText="Your skin concerns/conditions are:"
              >
              </StyledSummaryQuestion>
              <StyledSummaryQuestion
                answer={getQuestionAnswer(QuestionIds.adverseReactions)}
                questionText="You've had adverse reactions to:"
              >
              </StyledSummaryQuestion>
            </QuestionsAndAnswers>
          </SummaryWhatWeAlsoKnowWrap>
        </SummaryWrap>
      }
    </React.Fragment>
  )
}

const LoadingAnimationWrapper = styled.div`
  margin: auto;
  text-align: center;
  max-width: 90%;
`

const USPs = styled.div`
  border-top: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  width: 100%;
  max-width: 90%;
  padding: 11px 0;
  align-items: center;
  font-family: ${props => props.theme.subHeadingFont};
  display: grid;
  grid-template-columns: repeat(5, auto);
  font-size: 9pt;
  text-transform: uppercase;
  margin: 20px 0 40px;
  p {
    width: 100%;
    margin: 0;
  }
  span {
    display: block;
  }
  .circle {
    background: ${props => props.theme.brandColours.baseDarkGreen};
    height: 5px;
    width: 5px;
    margin: auto;
    border-radius: 50%;
  }
  @media screen and (min-width: 768px) {
    font-size: 10pt;
    padding: 12px 0;
    margin: 0 auto 40px auto;
    order: 2;
    span {
      display: inline-block;
    }
  }
  @media screen and (min-width: 980px) {
    max-width: 1024px;
    p {
      width: 343px;
    }
  }
`

const SummaryWhatWeAlsoKnowWrap = styled.div`
  width: 100%;
  margin-bottom: 50px;
  max-width: 850px;
  @media screen and (min-width: 768px) {
    display: grid;
    order: 4
    grid-template-rows: auto auto;
  }
`

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

const QuestionsAndAnswers = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    grid-row: 2;
    width: 100%;
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

const Mixture = styled.div`
  hr {
    margin: 50px auto;
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    grid-row: 2;
    width: 100%;
    display: flex;
    align-items: baseline;
    hr{
      display: none;
    }
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
  hr {
    border: none;
    max-width: 210px;
    border-bottom: solid 1px rgba(151,151,151,0.3);
  }
`

export default StyledSummary;