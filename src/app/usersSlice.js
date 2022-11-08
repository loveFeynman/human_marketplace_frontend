import { createSlice } from "@reduxjs/toolkit";

const initialState = { all: [], byAddress: {} };

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            const users = action.payload || [];
            const byAddress = {};
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.wallet) {
                    byAddress[user.wallet] = user;
                }
            }
            return {
                all: users,
                byAddress,
            };
        },
    },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;
