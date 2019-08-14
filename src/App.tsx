import React from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';
import StyledWelcome from './Container/Welcome';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import StyledHeader from './Components/Header';
import StyledFooter from './Components/Footer';



const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <StyledHeader></StyledHeader>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={StyledWelcome} />
            <StyledQuiz></StyledQuiz>
          </Switch>
        </BrowserRouter>
        <StyledFooter></StyledFooter>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
