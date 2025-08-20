import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer'

import authReducer from '@/features/auth/authSlice'
import persistStore from 'redux-persist/es/persistStore'

const persistConfig = {
  key: 'root',
  storage,
  // blacklist,
  // whitelist
}

const rootReducer = combineReducers({
  auth: authReducer,
})

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ serializableCheck: false })],
})

export const persistor = persistStore(store)
export default store
