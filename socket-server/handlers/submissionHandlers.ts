import { Server } from 'socket.io'

export const handleSubmissionEvents = (io: Server, type: string, payload: unknown) => {
    switch (type) {
        case "submission-created":
            io.emit("submission-created", payload)
            break
        
        case "submission-graded":
            io.emit("submission-graded", payload)
            break

        default:
            console.log("Unknown submission event type:", type)
    }
}