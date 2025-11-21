"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProgramEvents = void 0;
const handleProgramEvents = (io, type, payload) => {
    switch (type) {
        case "program-created":
            io.emit("program-created", payload);
            break;
        case "program-deleted":
            io.emit("program-deleted", payload);
            break;
        case "program-updated":
            io.emit("program-updated", payload);
            break;
        case "member-added":
            io.emit("member-added", payload);
            break;
        case "remove-member":
            io.emit("remove-member", payload);
            break;
        case "member-approved":
            io.emit("member-approved", payload);
            break;
        case "join-rejected":
            io.emit("join-rejected", payload);
            break;
        case "join-cancelled":
            io.emit("join-cancelled", payload);
            break;
        case "join-request-created":
            io.emit("join-request-created", payload);
            break;
        default:
            console.log("Unknown event type");
    }
};
exports.handleProgramEvents = handleProgramEvents;
