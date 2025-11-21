import { Server } from "socket.io";

export const handlefeedbackEvents = (io: Server, type: string, payload: unknown) => {
    switch(type) {
        case "feedback-created":
            io.emit('feedback-created', payload)
            break;
        default:
            console.log("Unknown feedback event type")
    }
}