import { createSlice } from "@reduxjs/toolkit";

const initialState = { userInfo: {}, isLoaded: false };

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            const newState = {
                ...state,
                isLoaded: true,
                userInfo: action.payload,
            };
            return newState;
        },
        clearUserInfo: () => {
            const clearState = {
                userInfo: {},
                isLoaded: false,
            };
            return clearState;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
