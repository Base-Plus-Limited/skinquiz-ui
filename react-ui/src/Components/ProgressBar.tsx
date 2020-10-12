import React, { useContext } from 'react';
import styled from 'styled-components';
import { QuizContext } from '../QuizContext';
import { IAnswer } from '../Interfaces/QuizQuestion';
import { track } from './Shared/Analytics';

export interface ProgressBarProps {
}

export interface SharedProgressBarProps {
  isQuizCompleted: boolean;
}

const StyledProgressBar: React.FC<ProgressBarProps> = () => {

  const { updateQuestionsAnswered, questionsAnswered, ingredients, updateIngredients, selectedSkinConditions, quizQuestions, uniqueId } = useContext(QuizContext);

  
  const removeLastQuestionAnswered = () => {
    if(questionsAnswered[questionsAnswered.length - 1].id === 1443) // skin condition question
      resetSkinCondition();
    if(questionsAnswered[questionsAnswered.length - 1].id === 706) // skin concern question
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

  const areAllQuestionsAnswered = () => {
    return quizQuestions.filter(x => x.answered).length === quizQuestions.length;
  }

  return (
    <ProgressBar style={{width: questionsAnswered.length + "0%" }}>
    </ProgressBar>
  );
}

const ProgressBar = styled.div`
  transition: all ease 0.45s;
  background: ${props => props.theme.brandColours.baseDefaultGreen};
`
  

export default StyledProgressBar;