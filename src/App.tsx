import React from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';



const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledQuiz></StyledQuiz>
    </ThemeProvider>
  );
}

export default App;
