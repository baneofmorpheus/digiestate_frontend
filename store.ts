import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './reducers/authentication';
import utilityReducer from './reducers/utility';
import adminReducer from './reducers/admin';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  utility: utilityReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);
