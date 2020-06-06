import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledSummaryButton } from './Button';
import StyledText from './Shared/Text';
import StyledH2 from './Shared/H2';
import StyledHR from './Shared/HR';
import StyledSubHeading from './Shared/SubHeading';
import StyledImage from './Shared/Image';
import plusIcon from './../Assets/plus.jpg';
import { WordpressProduct, IIngredient, Tag } from '../Interfaces/WordpressProduct';
import { IAnswer } from '../Interfaces/QuizQuestion';
import { IQuizData } from '../Interfaces/CompletedQuizDBModel';
import LoadingAnimation from './Shared/LoadingAnimation';
import { IErrorResponse } from '../Interfaces/ErrorResponse';
import ICustomProductDBModel from '../Interfaces/CustomProduct';
import { track } from './Shared/Analytics';

export interface SummaryProps {
}

const StyledSummary: React.FC<SummaryProps> = () => {
  const { ingredients, userName, baseIngredient, quizQuestions, setQuizToCompleted, setApplicationError, isQuizCompleted, uniqueId, updateIngredients } = useContext(QuizContext);

  useEffect(() => {
    rankIngredients();
  }, []);

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
      event_type: "Quiz completed",
      ingredients: `${sortedIngredients[0].name} & ${sortedIngredients[1].name}`,
      amendSelected: true
    }).then(() => {
      setQuizToCompleted(true);
      sendCompletedQuizQuestionsToApi();
      window.location.assign(`https://baseplus.co.uk/customise?productone=${sortedIngredients[0].id}&producttwo=${sortedIngredients[1].id}&username=${userName}`);
    });
  }

  const sendToWordpress = async () => {
    setQuizToCompleted(true);
    sendCompletedQuizQuestionsToApi();
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
      if(product)
        window.location.assign(`https://baseplus.co.uk/cart?add-to-cart=${product.id}`)
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

  const returnCompletedQuizData = (): IQuizData[] => {
    const quiz: IQuizData[] = quizQuestions.map(question => (
      {
        questionId: question.id,
        question: question.question,
        answer: question.customAnswer ? question.customAnswer : returnAnswers(question.answers)
      }
    ));
    return quiz;
  }

  const returnAnswers = (answers: IAnswer[]) => {
    const selectedAnswers = answers.filter(answer => answer.selected).map(answer => answer.value)[0];
    if (Array.isArray(selectedAnswers))
      return selectedAnswers.join(" & ");
    return selectedAnswers;
  }

  const sendCompletedQuizQuestionsToApi = () => {
    return fetch('/api/save-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify(returnCompletedQuizData())
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

  const createFinalProductToSaveToDatabase = () => {
    const databaseProduct: ICustomProductDBModel = {
      ingredients: sortedIngredients.map(ingredient => {
        return {
          name: ingredient.name,
          id: ingredient.id
        }
      }),
      amended: false
    };
    return databaseProduct;
  }

  const saveProductToDatabase = () => {
    track({
      distinct_id: uniqueId,
      event_type: "Quiz completed",
      ingredients: `${sortedIngredients[0].name} & ${sortedIngredients[1].name}`,
      amendSelected: false
    }).then(() => {
      return fetch('/api/save-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify(createFinalProductToSaveToDatabase())
      })
      .finally(() => sendToWordpress())
    });
  }

  const limitCharacterLength = (description: string) => {
    return description.slice(0, 73);
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


    let updateIngredientList: IIngredient[] = ingredients;

    if (filteredAnswers.some(x => x.toLowerCase() === 'lemon oil'))
      updateIngredientList = updateIngredientList.filter(x => x.id !== 697);

    if (filteredAnswers.some(x => x.toLowerCase() === 'sensitive'))
      updateIngredientList = updateIngredientList
        .filter(x => x.id !== 697)
        .filter(x => x.id !== 2054);
      

    updateIngredientList.forEach(ingredient => {
      filteredAnswers.forEach(a => {
        ingredient.tags.forEach(tag => {
          if (tag.name === a)
            ingredient.rank = ingredient.rank + 1;
        })
      })
    })
    updateIngredients(selectFinalIngredients(updateIngredientList, skinConcernAnswers));
    console.log('ingredientsAndRank', updateIngredientList.map(x => {
      return {
        name: x.name,
        rank: x.rank
      }
    }));
  }

  const selectFinalIngredients = (rankedIngredients: IIngredient[], skinConcerns: string[]) => {
    const categorisedIngredients: {concernOne: string, concernTwo: string, ingredientsOne: IIngredient[], ingredientsTwo: IIngredient[]} = {
      concernOne: "",
      concernTwo: "",
      ingredientsOne: [],
      ingredientsTwo: [],
    }
    rankedIngredients.forEach(x => {
      if (x.tags.some(t => t.name.toLowerCase() === skinConcerns[0])) {
        categorisedIngredients.concernOne = skinConcerns[0];
        categorisedIngredients.ingredientsOne.push(x);
      }
      if (x.tags.some(t => t.name.toLowerCase() === skinConcerns[1])) {
        categorisedIngredients.concernTwo = skinConcerns[1];
        categorisedIngredients.ingredientsTwo.push(x);
      }
    });
    // const tags = rankedIngredients.flatMap(r => r.tags);
    // const tagsWithOccurence = [...getTagsWithOccurence(tags)];
    // const uniqueTags = removeDuplicates(tagsWithOccurence).sort((a,b) => a.total - b.total).reverse();
    // console.log('uniqueTags', uniqueTags)
    
    // const conditionOneIngredients = 
    //   rankedIngredients.filter(x => x.tags.some(t => t.slug === uniqueTags[0].slug));
    // const conditionTwoIngredients = rankedIngredients
    //     .filter(x => x.tags.some(t => t.slug === uniqueTags[1].slug));
    
    // const highestRankedIngredientsOne = getHighestRankedIngredients(conditionOneIngredients);
    // const highestRankedIngredientsTwo = getHighestRankedIngredients(removeIngredientIfInSecondList(highestRankedIngredientsOne[0].id, conditionTwoIngredients));

    // let ingredientOne: IIngredient;
    // let ingredientTwo: IIngredient;

    // if (highestRankedIngredientsOne.length > 1) {
    //   ingredientOne = conditionOneIngredients[Math.floor(Math.random() * Math.floor(highestRankedIngredientsOne.length))];
    // } else {
    //   ingredientOne = highestRankedIngredientsOne[0];
    // }

    // if (highestRankedIngredientsTwo.length > 1) {
    //   const unselectedIngredients = highestRankedIngredientsTwo.filter(x => x.id !== ingredientOne.id);
    //   ingredientTwo = unselectedIngredients[Math.floor(Math.random() * Math.floor(unselectedIngredients.length))];
    // } else {
    //   ingredientTwo = highestRankedIngredientsTwo[0];
    // }
    // console.log('condition one list', conditionOneIngredients);
    // console.log('condition two list', conditionOneIngredients);
    // console.log('conditions with rank', uniqueTags);

    // rankedIngredients.forEach(x => {
    //   if(x.id === ingredientTwo.id)
    //     x.isSelectedForSummary = true;
    //   if(x.id === ingredientOne.id)
    //     x.isSelectedForSummary = true;
    // });
    return rankedIngredients;
  }

  const removeIngredientIfInSecondList = (id: number, ingredientListTwo: IIngredient[]) => {
    return ingredientListTwo.filter(x => x.id !== id);
  } 

  const getHighestRankedIngredients = (ingredients: IIngredient[]) => {
    const highestNum = Math.max(...ingredients.map(x => x.rank));
    return ingredients.filter(x => x.rank === highestNum);
  }

  const getTagsWithOccurence = (tags: Tag[]) => {
    return tags.map(c => {
      return {
        tagName: c.name,
        total: ingredients.filter(ing => ing.tags.some(t => t.name === c.name)).length,
        slug: c.slug
      };
    });
  }

  const removeDuplicates = (array: Array<{
    tagName: string,
    total: number,
    slug: string
  }>) => {
    return array.filter((v, i, a) => a.findIndex(t => (t.slug === v.slug)) === i)
  }

  return (
    <React.Fragment>
      <SummaryWrap>
        <SummaryGrid>
          {
            isQuizCompleted ?
              <div>
                <LoadingAnimation />
                <StyledText margin="0" text={`Thank you${userName ? ` ${userName}` : ''}, please wait whilst we create your bespoke product`}></StyledText>
              </div>
              :
              <React.Fragment>
                {<StyledH2 margin="7px 0 7px" text={`Skincare made for ${userName ? userName : 'you'}`}></StyledH2>}
                {
                  <SummaryBaseIngredient>
                    <StyledImage src={baseIngredient.images[0].src} alt={baseIngredient.name}></StyledImage>
                    <div>
                      <StyledSubHeading margin="0 0 0 0" fontSize="10pt" text={baseIngredient.name}></StyledSubHeading>
                      <StyledText margin="4px 0 0 0" fontSize="9pt" text={limitCharacterLength(baseIngredient.short_description)}></StyledText>
                    </div>
                  </SummaryBaseIngredient>
                }
                <StyledHR></StyledHR>
                <SummaryIngredientWrap>
                  {
                    sortedIngredients.map((ingredient, index) => (
                      <React.Fragment key={index}>
                        <SummaryIngredient key={ingredient.id}>
                          <StyledImage src={ingredient.images[0].src} alt={ingredient.name}></StyledImage>
                          <StyledSubHeading margin="0 0 0 0" fontSize="10pt" text={ingredient.name}></StyledSubHeading>
                          <StyledText margin="4px 0 0 0" fontSize="9pt" text={limitCharacterLength(ingredient.short_description)}></StyledText>
                        </SummaryIngredient>
                        {
                          index === 0 &&
                          <StyledImage width={15} src={plusIcon} alt="Plus icon"></StyledImage>
                        }
                      </React.Fragment>
                    ))
                  }
                </SummaryIngredientWrap>
                <StyledHR></StyledHR>
                <StyledSummaryButton addMargin onClick={amendIngredients}>Change</StyledSummaryButton>
                <StyledSummaryButton addMargin onClick={saveProductToDatabase}>Buy now</StyledSummaryButton>
              </React.Fragment>
          }
        </SummaryGrid>
      </SummaryWrap>
    </React.Fragment>
  )
}

const SummaryIngredientWrap = styled.div`
  position: relative;
  display: grid;
  align-items: center;
  max-width: 430px;
  grid-gap: 10px;
  margin: 0 auto;
  grid-template-columns: 1fr 15px 1fr;
`

const SummaryBaseIngredient = styled.div`
  display: grid;
  margin: 0 auto;
  align-items: center;
  width: 190px;
  img{
    margin: 0 auto;
    max-height: 110px;
  }
  p{
    height: 30px;
    overflow: hidden;
  }
  @media screen and (min-width: 768px) {
    img{
      grid-area: 1
    }
    text-align: left;
    grid-template-columns: 170px 1fr;
    width: 380px;
  }
`

const SummaryIngredient = styled.div`
  img{
    width: 90px;
  }
`

const SummaryWrap = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
  grid-template-columns: 20px 1fr 20px;
  grid-template-rows: 0 1fr 0;
`

const SummaryGrid = styled.div`
  grid-template-columns: 120px 1fr 120px;
  grid-area: 2/2;
`

export default StyledSummary;