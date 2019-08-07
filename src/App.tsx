import React from 'react';
import './App.css';
import { createStore } from 'redux';
import Reducer from './Reducers/Reducer';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import StyledQuiz from './Container/Quiz';

const store = createStore(Reducer);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledQuiz></StyledQuiz>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
