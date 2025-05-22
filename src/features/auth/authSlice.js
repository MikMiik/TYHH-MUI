import { createSlice } from "@reduxjs/toolkit"

import { getCurrentUser } from "./authAsync"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: null,
        isLoading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.currentUser = null
                state.isLoading = false
            })
    },
})

export { getCurrentUser }
export default authSlice.reducer
