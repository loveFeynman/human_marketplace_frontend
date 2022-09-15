import { ChainConfig } from "@constant";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { denom: ChainConfig.microDenom, amount: 0 };

export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        setBalance: (state, action) => action.payload,
    },
});

export const { setBalance } = balanceSlice.actions;

export default balanceSlice.reducer;
