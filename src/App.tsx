import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux';
import Reducer from './Reducers/Reducer';
import { Provider } from 'react-redux';
import Question from './Components/Question/Question';

const store = createStore(Reducer);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <Question question="test question"></Question>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    </Provider>
  );
}

export default App;
