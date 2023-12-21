
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { rootReducer } from './reducer';
import { configureStore } from '@reduxjs/toolkit';

export default function reduxConfig(onCompletion = () => { }) {
    // Create Redux store:
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    })
    const persistor = persistStore(store, null, onCompletion);
    return { store, persistor };
}