import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { optionReducer } from './options_reducer';
import { files } from './files';
import { visReducer } from './vis_reducer';

const rootReducer = combineReducers({
  options: optionReducer,
  files,
  vis: visReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
window.store = store;
export default store;
