import { useState } from "react"

export const useMeetingsModal = () => {
    const [createMeet, setCreateMeet] = useState(false)

    const createToggleMeet = () => {
        setCreateMeet((prev) => !prev)
    }

    return { createMeet, createToggleMeet }
}

