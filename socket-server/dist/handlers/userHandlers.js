"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserEvent = void 0;
const handleUserEvent = (io, type, payload) => {
    switch (type) {
        case "user-created":
            io.emit("user-created", payload);
            break;
        case "user-deleted":
            io.emit("user-deleted", payload);
            break;
        case "user-updated":
            io.emit("user-updated", payload);
            break;
        default:
            console.log("❗ Unknown user event type:", type);
    }
};
exports.handleUserEvent = handleUserEvent;
