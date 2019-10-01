import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledBackButton } from './Button';
import { IAnswer } from '../Interfaces/QuizQuestion';

export interface FooterProps {
}

export interface SharedFooterProps {
  progressCount: number;
}

const StyledFooter: React.FC<FooterProps> = () => {

  const { progressCount, updateQuestionsAnswered, questionsAnswered, ingredients, updateIngredients, selectedSkinConditions } = useContext(QuizContext);

  
  const removeLastQuestionAnswered = () => {
    if(questionsAnswered[questionsAnswered.length - 1].id === 1443) // skin condition question
      resetSkinCondition();
    if(questionsAnswered[questionsAnswered.length - 1].id === 706) // skin concern question
      resetSkinConcernAnswers(questionsAnswered[questionsAnswered.length - 1].answers);
    questionsAnswered[questionsAnswered.length - 1].answers.forEach(answer => answer.selected = false);
    questionsAnswered.pop();
    updateQuestionsAnswered([...questionsAnswered]);
    removeRanks();
  }

  const resetSkinConcernAnswers = (answers: IAnswer[]) => {
    answers.forEach(answer => answer.disable = false)
  }

  const resetSkinCondition = () => {
    selectedSkinConditions.length = 0;
  }
  
  const removeRanks = () => {
    const derankedIngredients = ingredients.map(ingredient => {
      if(ingredient.previouslyRanked)
        ingredient.rank = ingredient.rank - 1
      return ingredient;
    })
    updateIngredients([...derankedIngredients])
  }

  return (
    <Footer>
      <InnerFooterWrap progressCount={progressCount}>
      <ProgressCount progressCount={progressCount}>
        <ProgressCountSmall>
          {progressCount}
        </ProgressCountSmall>
        /8
      </ProgressCount>
      {
        progressCount > 1 &&
        <StyledBackButton onClick={removeLastQuestionAnswered}>back</StyledBackButton>
      }
      </InnerFooterWrap>
    </Footer>
  );
}

const Footer = styled.footer`
  border-top: solid 1px ${props => props.theme.brandColours.baseLightGreen};
  background: #fff;
  padding: 20px 40px;
  `
  
const ProgressCount = styled.span`
  text-align: ${(props: SharedFooterProps) => props.progressCount > 1 ? "" : "center"};
  font-family: ${props => props.theme.bodyFont};
  font-size: 12pt;
  display: block;
`
const ProgressCountSmall = styled.span`
  font-size: 10pt;
`

const InnerFooterWrap = styled.div`
  margin: 0 auto;
  display: ${(props: SharedFooterProps) => props.progressCount > 1 ? "flex" : ""}
  justify-content: ${(props: SharedFooterProps) => props.progressCount > 1 ? "space-between" : ""}
`

export default StyledFooter;