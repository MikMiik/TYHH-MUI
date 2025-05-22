import { createAsyncThunk } from "@reduxjs/toolkit"

import authService from "@/services/authService"

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
    const res = await authService.me()

    if (res.status === "success") {
        return res.data
    } else {
        console.error(res?.message)
        return null
    }
})
