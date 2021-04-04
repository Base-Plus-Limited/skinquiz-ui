import React, { useContext } from 'react';
import styled from 'styled-components';

import logo from './../Assets/base_light_green.png';
import StyledLink from './Shared/Link';
import StyledImage from './Shared/Image';
import { StyledBackButton } from './Button';
import { QuizContext } from '../QuizContext';
import { track } from './Shared/Analytics';
import { IAnswer } from '../Interfaces/QuizQuestion';
import { QuestionIds } from '../Interfaces/WordpressQuestion';

export interface HeaderProps {
}
 
const StyledHeader: React.FC<HeaderProps> = () => {

  const { progressCount, updateQuestionsAnswered, questionsAnswered, ingredients, updateIngredients, selectedSkinConditions, quizQuestions, uniqueId, showSummaryCTAs } = useContext(QuizContext);

  const areAllQuestionsAnswered = () => {
    const allQUestionsAnswered = quizQuestions.filter(x => x.answered).length === quizQuestions.length;
    setTimeout(() => {
      showSummaryCTAs(allQUestionsAnswered);
    }, 2000)
    return allQUestionsAnswered;
  }

  const removeLastQuestionAnswered = () => {
    if(questionsAnswered[questionsAnswered.length - 1].id === QuestionIds.whenYouWakeUpInTheMorning)
      resetSkinCondition();
    if(questionsAnswered[questionsAnswered.length - 1].id === QuestionIds.skinConcernsAndConditions)
      resetSkinConcernAnswers(questionsAnswered[questionsAnswered.length - 1].answers);
    questionsAnswered[questionsAnswered.length - 1].answers.forEach(answer => answer.selected = false);
    questionsAnswered[questionsAnswered.length - 1].answered = false;
    questionsAnswered.pop();
    updateQuestionsAnswered([...questionsAnswered]);
    resetRanks();
    track({
      distinct_id: uniqueId,
      event_type: "Back selected"
    });
  }

  const resetSkinConcernAnswers = (answers: IAnswer[]) => {
    answers.forEach(answer => answer.disable = false)
  }

  const resetSkinCondition = () => {
    selectedSkinConditions.length = 0;
  }
  
  const resetRanks = () => {
    const derankedIngredients = ingredients.map(ingredient => {
      if(ingredient.previouslyRanked)
        ingredient.rank = ingredient.rank - 1
      return ingredient;
    })
    updateIngredients([...derankedIngredients])
  }

  return <Header className={`${(questionsAnswered.length < 2) || (areAllQuestionsAnswered()) ? "center-align" : "" }`}>
    <StyledLink href={"https://baseplus.co.uk/?utm_source=skin-quiz-logo&utm_medium=web&utm_campaign=back-to-main-site"}>
      <StyledImage src={logo} alt={"base plus"}></StyledImage>
    </StyledLink>
    {
        (progressCount > 1) && (!areAllQuestionsAnswered())  ?
        <StyledBackButton onClick={removeLastQuestionAnswered}>back</StyledBackButton>
        : ''
      }
  </Header>

}

const Header = styled.div`
  border-bottom: solid 2px ${props => props.theme.brandColours.baseLightGreen};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  img{
    width: 80px;
  }
`;

export default StyledHeader;