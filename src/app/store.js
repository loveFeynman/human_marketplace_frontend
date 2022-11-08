import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import collectionReducer from "./collectionsSlice";
import marketplaceNftsReducer from "./marketplaceNftsSlice";
import myNftsReducer from "./myNftsSlice";
import balanceReducer from "./balanceSlice";
import adminReducer from "./adminSlice";
import userReducer from "./userSlice";
import usersReducer from "./usersSlice";

const persistConfig = {
    key: "root",
    storage,
};

const reducer = persistReducer(
    persistConfig,
    combineReducers({
        admin: adminReducer,
        collections: collectionReducer,
        marketplaceNfts: marketplaceNftsReducer,
        myNfts: myNftsReducer,
        balance: balanceReducer,
        user: userReducer,
        users: usersReducer,
    })
);

export const store = configureStore({
    reducer,
    middleware: (mw) => mw({ immutableCheck: false, serializableCheck: false }),
});

export const persistor = persistStore(store);
