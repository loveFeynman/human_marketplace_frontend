import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const marketplaceNftsSlice = createSlice({
    name: "marketplaceNfts",
    initialState,
    reducers: {
        setMarketplaceNfts: (state, action) => {
            const [key, data] = action.payload;
            const newState = {
                ...state,
                [key]: data,
            };
            return newState;
        },
    },
});

export const { setMarketplaceNfts } = marketplaceNftsSlice.actions;

export default marketplaceNftsSlice.reducer;
