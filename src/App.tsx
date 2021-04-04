import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';
import StyledHeader from './Components/Header';
import { QuizProvider } from './QuizContext';

const App: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
        <AppWrapper>
          <QuizProvider>
            <StyledHeader></StyledHeader>
            <StyledQuiz rows={0} marginValue={0}></StyledQuiz>
          </QuizProvider>
        </AppWrapper>
    </ThemeProvider>
  );
}

const AppWrapper = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 60px 3px 1fr;
  .center-align {
    justify-content: center;
    padding: 0;
  }
`

export default App;
