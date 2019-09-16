import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { StyledBackButton } from './Button';

export interface FooterProps {
}

export interface SharedFooterProps {
  progressCount: number;
}

const StyledFooter: React.FC<FooterProps> = () => {

  const { progressCount, updateQuestionsAnswered, questionsAnswered, ingredients, updateIngredients } = useContext(QuizContext);

  
  const removeLastQuestionAnswered = () => {
    questionsAnswered[questionsAnswered.length - 1].answers.forEach(answer => answer.selected = false);
    questionsAnswered.pop();
    updateQuestionsAnswered([...questionsAnswered]);
    removeRanks();
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
        {progressCount}/8
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
  width: 100%;
  background: #fff;
  padding: 20px 0;
`

const ProgressCount = styled.span`
  text-align: ${(props: SharedFooterProps) => props.progressCount > 1 ? "" : "center"};
  display: block;
`

const InnerFooterWrap = styled.div`
  width: 90%;
  max-width: 980px;
  margin: 0 auto;
  display: ${(props: SharedFooterProps) => props.progressCount > 1 ? "flex" : ""}
  justify-content: ${(props: SharedFooterProps) => props.progressCount > 1 ? "space-between" : ""}
`

export default StyledFooter;