import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAdmin: false };

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setIsAdmin: (state, action) => {
            const newState = {
                ...state,
                isAdmin: action.payload,
            };
            return newState;
        },
    },
});

export const { setIsAdmin } = adminSlice.actions;

export default adminSlice.reducer;
