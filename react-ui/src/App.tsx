import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';
import StyledWelcome from './Container/Welcome';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import StyledHeader from './Components/Header';
import { QuizProvider } from './QuizContext';
import DownloadData from './Container/DownloadData';
import StyledProgressBar from './Components/ProgressBar';

const App: React.FC = () => {


  return (
    <ThemeProvider theme={theme}>
        <AppWrapper>
          <QuizProvider>
            <StyledHeader></StyledHeader>
            <StyledProgressBar></StyledProgressBar>
            <BrowserRouter>
              <Switch>
                <Route path="/" exact component={StyledWelcome} />
                <Route path="/quiz" component={StyledQuiz} />
                <Route path="/download-data" component={DownloadData} />
              </Switch>
            </BrowserRouter>
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
