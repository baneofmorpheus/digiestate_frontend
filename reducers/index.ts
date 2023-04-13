import { combineReducers } from 'redux';

import authenticationReducer from './authentication';
import utilityReducer from './utility';
import adminReducer from './admin';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  utility: utilityReducer,
  admin: adminReducer,
});

export default rootReducer;
