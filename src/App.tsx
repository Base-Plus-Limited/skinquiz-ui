import React from 'react';
import './App.css';
import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';
import StyledWelcome from './Container/Welcome';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import StyledHeader from './Components/Header';
import StyledFooter from './Components/Footer';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <StyledHeader></StyledHeader>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={StyledWelcome} />
            <Route path="/quiz" component={StyledQuiz} />
          </Switch>
        </BrowserRouter>
        <StyledFooter></StyledFooter>
      </AppWrapper>
    </ThemeProvider>
  );
}

const AppWrapper = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 77px auto 58px;
`

export default App;
