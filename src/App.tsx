import React from 'react';
import './App.css';
import { createStore } from 'redux';
import Reducer from './Reducers/Reducer';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import StyledHeader from './Components/Header/Header';
import theme from './theme';

const store = createStore(Reducer);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledHeader></StyledHeader>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
