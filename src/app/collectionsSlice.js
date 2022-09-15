import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addresses: {},
};

export const collectionSlice = createSlice({
    name: "collections",
    initialState,
    reducers: {
        setCollectionInfo: (state, action) => {
            const [key, data] = action.payload;
            const newState = {
                ...state,
                [key]: data,
            };
            return newState;
        },
        setCollectionAddresses: (state, action) => {
            const data = action.payload;
            const newState = {
                ...state,
                addresses: data,
            };
            return newState;
        },
    },
});

export const { setCollectionInfo, setCollectionAddresses } =
    collectionSlice.actions;

export default collectionSlice.reducer;
