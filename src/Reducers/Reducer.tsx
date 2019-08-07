import { Action } from "redux";
import InitialState from './../State/InitialState';

const Reducer = (state = InitialState, action: Action) => {
  console.log('reducer', state, action);
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        count: state.count - 1 
      };
    default:
      return state;
  }
}
 
export default Reducer;