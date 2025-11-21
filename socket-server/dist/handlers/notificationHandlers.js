"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotifEvents = void 0;
const handleNotifEvents = (io, type, payload) => {
    switch (type) {
        case "notification-created":
            io.emit('notification-created', payload);
            break;
        default:
            console.log("Unknown Notification event type");
    }
};
exports.handleNotifEvents = handleNotifEvents;
