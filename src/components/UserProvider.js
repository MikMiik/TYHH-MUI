import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { getCurrentUser } from "@/features/auth/authAsync"

function UserProvider() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    return null
}

export default UserProvider
