import { combineReducers } from 'redux';

import authenticationReducer from './authentication';
import utilityReducer from './utility';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  utility: utilityReducer,
});

export default rootReducer;
