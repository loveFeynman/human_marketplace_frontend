import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const myNftsSlice = createSlice({
    name: "myNfts",
    initialState,
    reducers: {
        setMyNfts: (state, action) => {
            const [key, data] = action.payload;
            const newState = {
                ...state,
                [key]: data,
            };
            return newState;
        },
        clearMyNfs: () => ({}),
    },
});

export const { setMyNfts, clearMyNfs } = myNftsSlice.actions;

export default myNftsSlice.reducer;
