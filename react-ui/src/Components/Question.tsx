import React, { useContext, ChangeEvent, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { IQuizQuestion, IAnswer } from '../Interfaces/QuizQuestion';
import StyledAnswer from './Answer';
import StyledSkintoneAnswer from './SkintoneAnswer';
import { QuizContext } from '../QuizContext';
import { IIngredient } from '../Interfaces/WordpressProduct';
import StyledInput from './Shared/Input';
import StyledPrompt from './Prompt';
import { StyledButton } from './Button';
import faceImg from './../Assets/face_img.jpg';
import CheekArea from './../Assets/cheek_areas.png';
import TZoneArea from './../Assets/tzone_areas.png';
import { ISkinCondition } from '../Interfaces/SkinCondition';
import SkinConditionEnums from './../SkinConditons';
import { track } from './Shared/Analytics';

export interface QuestionProps {
  questions: IQuizQuestion[];
}

interface PanelProps {
  isVisible: boolean;
  isSkinToneAnswers: boolean;
}


const StyledQuestion: React.FC<QuestionProps> = ({ questions }: QuestionProps) => {
  const { questionInputAnswer, updateQuestionInputAnswer, quizQuestions, updateQuizQuestions, ingredients, updateIngredients, questionsAnswered, updateQuestionsAnswered, selectedSkinConditions, updateSelectedSkinConditions, uniqueId } = useContext(QuizContext);

  const selectAnswer = (answeredQuestion: IQuizQuestion, answerIndex: number) => {
    if(answeredQuestion.isMobilePanelOpen && answeredQuestion.id !== 706)
      toggleAnswersPanel(answeredQuestion);
    if(answeredQuestion.isSkinConditionQuestion)
      return skinConditionAnswerSelection(answeredQuestion, answerIndex);
    if(answeredQuestion.id === 706)
      return answerSkinConcernQuestion(answeredQuestion, answerIndex);
    const updatedQuestions = quizQuestions.map(question => {
      if (answeredQuestion.id === question.id) {
        question.answers.forEach(answer => {
          answer.selected = false;
          if (answer.id === answeredQuestion.answers[answerIndex].id) {
            if (answeredQuestion.answers[answerIndex].meta[answerIndex] === "custom") {
              question.answered = false;
              showInput(answeredQuestion.id);
              return
            }
            question.customAnswer = "";
            answer.selected = true;
            question.answered = true;
            doValuesMatch(answeredQuestion.answers[answerIndex], answerIndex); // refactor this to return a boolean
          }
        })
      }
      return question;
    });
    updateQuizQuestions(updatedQuestions);
    if (answeredQuestion.answered)
      doQuestionIdsMatch(answeredQuestion);
    // getCompletedQuizQuestions();
  }

  const answerSkinConcernQuestion = (answeredQuestion: IQuizQuestion, answerIndex: number) => {
    const updatedQuizQuestions = quizQuestions.map(question => {
      if(question.id === answeredQuestion.id) {
        answeredQuestion.answers[answerIndex].selected = !answeredQuestion.answers[answerIndex].selected;
        if(areTwoSkinConcernAnswersSelected(question)){
          question.answered = true;
          toggleAnswersPanel(answeredQuestion);
          doQuestionIdsMatch(question);
        } else {
          question.answered = false;
          if (questionsAnswered[questionsAnswered.length - 1].id === 706) {
            questionsAnswered.pop();
          }
        }
      }
      return question;
    });
    updateQuizQuestions([...updatedQuizQuestions]);
  }

  const areTwoSkinConcernAnswersSelected = (question: IQuizQuestion) => {
    question.totalAnswersSelected = question.answers.filter(answer => answer.selected).length;
    if(question.totalAnswersSelected === 2) {
      toggleAnswersDisabilityIfNotSelected(question);
    } else {
      resetAnswersDisability(question);
    }
    return question.totalAnswersSelected === 2;
  }

  const resetAnswersDisability = (question: IQuizQuestion) => {
    question.answers.forEach(answer => answer.disable = false);
  }

  const toggleAnswersDisabilityIfNotSelected = (question: IQuizQuestion) => {
    question.answers.forEach(answer => {
      if(!answer.selected) {
        answer.disable = !answer.disable;
      }
    });
  }

  const skinConditionAnswerSelection = (answeredQuestion: IQuizQuestion, answerIndex: number) => {
    quizQuestions.map(question => {
      if(question.id === answeredQuestion.id) {
        if (answerIndex > 2) {
          resetSelectedAnswers(question.answers, answerIndex)
          answeredQuestion.answers[answerIndex].selected = true;
          logSkinConditionAnswers(question.answers);
          return;
        }
        resetSelectedAnswers(question.answers, answerIndex)
        answeredQuestion.answers[answerIndex].selected = true;
        logSkinConditionAnswers(question.answers);
      }
    })
    updateQuizQuestions([...quizQuestions])
  }

  const resetSelectedAnswers = (answers: IAnswer[], answerIndex: number) => {
    if(answerIndex > 2)
      return answers.slice(3).map(answer => answer.selected = false)
    answers.slice(0,3).map(answer => answer.selected = false)
  }

  const showInput = (questionId: number) => {
    const updatedVisibilityQuestions = (questions.map(question => {
      if (question.id === questionId) {
        question.isInputVisible = true;
        return question;
      }
    }) as IQuizQuestion[]);
    updateQuizQuestions([...updatedVisibilityQuestions]);
  }

  const logQuestionInput = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuestionInputAnswer(e.target.value);
  }

  const customAnswerWrapperHandler = (questionId?: number) => {
    if (questionId) {
      if (questionInputAnswer.length) {
        submitAnswer(questionId);
        hideInput();
      }
      return;
    }
    hideInput();
  }

  const hideInput = () => {
    quizQuestions.forEach(question => {
      question.isInputVisible = false;
    });
    updateQuizQuestions([...quizQuestions]);
  }

  const submitAnswer = (questionId: number) => {
    quizQuestions.forEach(question => {
      if (question.id === questionId) {
        question.customAnswer = questionInputAnswer;
        question.answered = true;
        doQuestionIdsMatch(question);
        setCustomAnswerAsSelected(question);
      }
    });
    updateQuizQuestions([...quizQuestions]);
  }

  const setCustomAnswerAsSelected = (question: IQuizQuestion) => {
    question.answers[question.answers.length - 1].selected = true;
  }

  const getCompletedQuizQuestions = () => { // TRIGGGER THIS WHEN FINAL INGREDIENTS ARE BEING SENT TO WORDPRESS
    // if (progressCount === 4) {
    //   const completedQuizAnswers: ICompletedQuiz[] = questionsAnswered.map(answeredQ => {
    //     const { question, answers, id } = answeredQ;
    //     return {
    //       id,
    //       question,
    //       answer: answers.filter(answer => answer.selected)[0].value
    //     }
    //   })
    //   try {
    //     sendCompletedQuizQuestionsToApi(completedQuizAnswers)
    //   }
    //   catch (error) {
    //     console.log(error)
    //   }
    // }
  }



  const doQuestionIdsMatch = (answeredQuestion: IQuizQuestion) => {
    if(questionsAnswered.length) {
      if (questionsAnswered[questionsAnswered.length - 1].id === answeredQuestion.id){
        return;
      }
      track({
        distinct_id: uniqueId,
        event_type: "Question answered",
        question_id: answeredQuestion.id
      });
      updateQuestionsAnswered([...questionsAnswered, answeredQuestion]);
      return;
    }
    track({
      distinct_id: uniqueId,
      event_type: "Question answered",
      question_id: answeredQuestion.id
    });
    updateQuestionsAnswered([answeredQuestion]);
  }

  const rankIngredients = (answerValue: string, tagValue: string, ingredient: IIngredient) => {
    ingredient.previouslyRanked = false;
    if (answerValue === tagValue) {
      ingredient.previouslyRanked = true;
      ingredient.rank = ingredient.rank + 1;
    }
  }

  const doValuesMatch = (answer: IAnswer, answerIndex: number) => {
    ingredients.forEach((ingredient: IIngredient) => {
      ingredient.tags.forEach(tag => {
        if(answer.meta[answerIndex] === undefined)
          return;
        if (answer.meta[answerIndex].includes(',')) {
          const metaArray = answer.meta[answerIndex].split(',');
          rankIngredients(metaArray[answerIndex], tag.name, ingredient);
        } else {
          rankIngredients(answer.meta[answerIndex], tag.name, ingredient);
        }
      })
    })
    updateIngredients(ingredients);
  }

  const logSkinConditionAnswers = (answers: IAnswer[]) => {
    const selectedAnswers = [] as ISkinCondition[];
    answers.map((answer, index) => {
      if (answer.selected)
        selectedAnswers.push({ answer, index })
    });
    updateSelectedSkinConditions(selectedAnswers)
  }

  const returnSkinCondition = () => {
    const conditionId = `${selectedSkinConditions[0].index}${selectedSkinConditions[1].index}`;
    if(selectedSkinConditions.length === 2)
      return `Your skin type is ${SkinConditionEnums[conditionId]}`;
    return "";
  }

  const saveSkinConditionAnswer = () => {
    const conditionId = `${selectedSkinConditions[0].index}${selectedSkinConditions[1].index}`;
    const skinConditionQuestion = quizQuestions.filter(question => question.id === 1443);
    skinConditionQuestion[0].customAnswer = SkinConditionEnums[conditionId];
    skinConditionQuestion[0].answered = true;
    updateQuestionsAnswered([...questionsAnswered, skinConditionQuestion[0]]);
    track({
      distinct_id: uniqueId,
      event_type: "Question answered",
      question_id: skinConditionQuestion[0].id
    });
  }

  const cheekZoneMargin = () => { // to refactor
    let indexSpecificMargin;

    if ((selectedSkinConditions.length === 1) && (selectedSkinConditions[0].index > 2))
      switch (selectedSkinConditions[0].index) {
        case 4:
          indexSpecificMargin = { margin: `0 0 0 -298px`, display: "block" }
          break;
        case 5:
          indexSpecificMargin = { margin: `0 0 0 -596px`, display: "block" }
          break;
        default:
          indexSpecificMargin = { margin: `0 0 0 0`, display: "block" }
          break;
      }

      if (selectedSkinConditions.length === 2)
        switch (selectedSkinConditions[1].index) {
          case 4:
            indexSpecificMargin = { margin: `0 0 0 -298px`, display: "block" }
            break;
          case 5:
            indexSpecificMargin = { margin: `0 0 0 -596px`, display: "block" }
            break;
          default:
            indexSpecificMargin = { margin: `0 0 0 0`, display: "block" }
            break;
        }

    return indexSpecificMargin;
  }

  const returnTZoneMargin = () => { // to refactor
    let indexSpecificMargin;

    if ((selectedSkinConditions.length === 1) && (selectedSkinConditions[0].index < 3))
      switch (selectedSkinConditions[0].index) {
        case 1:
          indexSpecificMargin = { margin: `0 0 0 -250px`, display: "block" }
          break;
        case 2:
          indexSpecificMargin = { margin: `0 0 0 -506px`, display: "block" }
          break;
        default:
          indexSpecificMargin = { margin: `0 0 0 0`, display: "block" }
          break;
      }

    if(selectedSkinConditions.length === 2)
      switch (selectedSkinConditions[0].index) {
        case 1:
          indexSpecificMargin = { margin: `0 0 0 -250px`, display: "block" }
          break;
        case 2:
          indexSpecificMargin = { margin: `0 0 0 -506px`, display: "block" }
          break;
        default:
          indexSpecificMargin = { margin: `0 0 0 0`, display: "block" }
          break;
      }
      return indexSpecificMargin;
  }

  const toggleAnswersPanel = (question: IQuizQuestion) => {
    const updatedQuizQuestions = quizQuestions.map(quizQuestion => {
      if(question.id === quizQuestion.id)
        quizQuestion.isMobilePanelOpen = !quizQuestion.isMobilePanelOpen;
      return quizQuestion;
    });
    updateQuizQuestions([...updatedQuizQuestions]);
  }

  const returnSelectedAnswerValue = (question: IQuizQuestion) => {
    if(question.customAnswer)
      return `${question.customAnswer}`;
    const selectedAnswer = question.answers.filter(answer => answer.selected);  
    if(selectedAnswer.length === 2)
      return `Selected: ${selectedAnswer[0].value} & ${selectedAnswer[1].value}`;
    if(selectedAnswer.length === 1)
      return `Selected: ${selectedAnswer[0].value}`;
    return "Select to choose an answer";
  }

  return (
    <QuestionWrapper>
      {
        questions.map(question =>
          question.isSkinConditionQuestion ?
          <SkinConditionQuestion key={question.id}>
              <div>
                {question.question}<br /><br />
                {question.prompt && <StyledPrompt noMargin={true} prompt={question.prompt[0]}></StyledPrompt>}  <br />
                {question.answers.slice(0,3).map((answer: IAnswer, index: number) => {
                  return <StyledAnswer isDisabled={false} value={answer.value} selected={answer.selected} selectAnswer={() => selectAnswer(question, index)} key={index}>{answer.value}
                  </StyledAnswer>
                  })}
                <br/>
                <StyledHR></StyledHR>
                {question.prompt && <StyledPrompt noMargin={true} prompt={question.prompt[1]}></StyledPrompt>}  <br />
                {question.answers.slice(3).map((answer: IAnswer, index: number) => {
                  return <StyledAnswer value={answer.value} isDisabled={false} selected={answer.selected} selectAnswer={() => selectAnswer(question, index + 3)} key={index}>{answer.value}
                  </StyledAnswer>
                })}
                <p>{selectedSkinConditions.length === 2 ? returnSkinCondition() : ""}</p>
                {
                  selectedSkinConditions.length === 2 ?
                  <StyledButton onClickHandler={saveSkinConditionAnswer}>Next</StyledButton>
                  : ""
                }
              </div>
              <FaceImageWrapper>
                <CheekImageArea style={cheekZoneMargin()} src={CheekArea}></CheekImageArea>
                <TZoneImageArea style={returnTZoneMargin()} src={TZoneArea}></TZoneImageArea>
                <img src={faceImg} alt="" />
              </FaceImageWrapper>
          </SkinConditionQuestion>
          :
          <HalfScreenQuestion key={question.id}>
            {question.question}<br />
            {question.prompt && <StyledPrompt prompt={question.prompt}></StyledPrompt>}  <br />
            {
              question.isInputVisible ?
                <span>
                  <StyledInput logInputValue={logQuestionInput} width="500px" placeholderText="Let us know" type="text"></StyledInput>
                  <StyledButton addMargin onClickHandler={() => customAnswerWrapperHandler()}>close</StyledButton>
                  <StyledButton onClickHandler={() => customAnswerWrapperHandler(question.id)}>save</StyledButton>
                </span>
                :
                <React.Fragment>
                    {
                      question.isSkintoneQuestion ?
                        <MobileAnswersWrapper>
                          <StyledButton AnswerSelectedOnMobile={question.answered} onClickHandler={() => toggleAnswersPanel(question)}>{question.answered ? returnSelectedAnswerValue(question) : "Select from the dropdown"}</StyledButton>
                          <Panel className="mobileAnswersPanel" isVisible={question.isMobilePanelOpen} isSkinToneAnswers={question.isSkintoneQuestion}>
                            {
                              question.answers.map((answer: IAnswer, index: number) => {
                                return <StyledSkintoneAnswer selected={answer.selected} value={answer.value} skinColour={answer.skinColour} selectAnswer={() => selectAnswer(question, index)} key={index}>
                                </StyledSkintoneAnswer>
                              })
                            }
                            <span className="panelBackground" onClick={() => toggleAnswersPanel(question)}></span>
                          </Panel>
                        </MobileAnswersWrapper>
                        :
                        question.displayAnswersAsADropdownOnMobile ?
                          <MobileAnswersWrapper>
                            <StyledButton AnswerSelectedOnMobile={question.answered} onClickHandler={() => toggleAnswersPanel(question)}>{question.answered ? returnSelectedAnswerValue(question) : "Select from the dropdown"}</StyledButton>
                            <Panel className="mobileAnswersPanel" isVisible={question.isMobilePanelOpen} isSkinToneAnswers={question.isSkintoneQuestion}>
                              {
                                question.answers.map((answer, index) => (
                                  <StyledAnswer isDisabled={answer.disable} value={answer.value} selected={answer.selected} selectAnswer={() => selectAnswer(question, index)} key={index}></StyledAnswer>
                                ))
                              }
                              <span className="panelBackground" onClick={() => toggleAnswersPanel(question)}></span>
                            </Panel>
                          </MobileAnswersWrapper>
                          :
                          question.answers.map((answer: IAnswer, index: number) => (
                            <StyledAnswer isDisabled={answer.disable} selected={answer.selected} value={answer.value} selectAnswer={() => selectAnswer(question, index)} key={index}></StyledAnswer>
                          ))
                    }
                </React.Fragment>
            }
          </HalfScreenQuestion>
        )
      }
    </QuestionWrapper>
  )
}


const MobileAnswersWrapper = styled.div`
  @media screen and (min-width: 768px) {
    button {
      display: none;
    }
    .mobileAnswersPanel {
      position: static;
      width: 100%;
      padding: 0;
      background: none;
      display: block;
    }
  }
`

const Panel = styled.div`
  display: ${(props: PanelProps) => props.isVisible ? "grid" : "none"};
  grid-template-columns: ${(props: PanelProps) => props.isSkinToneAnswers ? "repeat(2, 1fr)" : "1fr"};
  grid-template-rows: ${(props: PanelProps) => props.isSkinToneAnswers ? "repeat(3, 150px)" : "auto"};
  padding: 15px;
  background: #fff;
  overflow-y: scroll;
  position: absolute;
  top: ${(props: PanelProps) => props.isSkinToneAnswers ? "0px" : "-10px"};
  z-index: 12;
  left: 0;
  top: -25px;
  bottom: 0;
  right: 0;
  justify-content: space-evenly;
  .panelBackground {
    width:100%;
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
  }
  @media screen and (min-width: 768px) {
    overflow-y: visible;
  }
`;

const FaceImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
`;

// to refactor
const TZoneImageArea = styled.img`
  position: absolute;
  top: 110px;
  left: 81px;
  z-index: 5;
  display: none;
  `
  // to refactor
  const CheekImageArea = styled.img`
  position: absolute;
  top: 251px;
  left: 63px;
  z-index: 5;
  display: none;
`

const HalfScreenQuestion = styled.div`
  margin: 0;
  padding: 0 10px;
  font-size: 11pt;
  overflow: hidden;
  font-family: ${props => props.theme.subHeadingFont};
`;

const StyledHR = styled.hr`
margin: 15px auto;
max-width: 200px;
border: none;
border-bottom: solid 1px ${props => props.theme.brandColours.basePink};
  @media screen and (min-width: 768px) {
    margin: 30px auto;
  }
`;

const SkinConditionQuestion = styled.div`
  font-family: ${props => props.theme.subHeadingFont};
  grid-row: 1/ span 2;
  @media screen and (min-width: 768px) {
    display: grid;
    align-items: center;
    margin: 0 auto;
    grid-template-columns: 523px 340px;
    grid-row: 1/3;
  }
`;

const QuestionWrapper = styled.div`
  display: grid;
  width: 100vw;
  align-items: center;
  text-align: center;
  margin: auto;
  position: relative;
  grid-template-rows: repeat(2, 260px);
`;

export default StyledQuestion;