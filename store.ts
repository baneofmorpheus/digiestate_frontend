import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './reducers/authentication';
import utilityReducer from './reducers/utility';
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
export const persistor = persistStore(store);
