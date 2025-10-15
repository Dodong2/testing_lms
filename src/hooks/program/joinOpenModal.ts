import { useState } from "react"

export const joinOpenModal = () => {
    const [joinOpen, setJoinOpen] = useState(false)

    const toggleJoinOpen = () => {
        setJoinOpen((prev) => ! prev)
    }

    return { joinOpen, toggleJoinOpen }
}
