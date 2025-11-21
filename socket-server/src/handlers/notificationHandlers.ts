import { Server } from "socket.io";

export const handleNotifEvents = (io: Server, type: string, payload: unknown) => {
    switch(type) {
        case "notification-created":
            io.emit('notification-created', payload)
            break;
        default:
            console.log("Unknown Notification event type")
    }
}