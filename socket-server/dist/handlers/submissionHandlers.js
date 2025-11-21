"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmissionEvents = void 0;
const handleSubmissionEvents = (io, type, payload) => {
    switch (type) {
        case "submission-created":
            io.emit("submission-created", payload);
            break;
        case "submission-graded":
            io.emit("submission-graded", payload);
            break;
        default:
            console.log("Unknown submission event type:", type);
    }
};
exports.handleSubmissionEvents = handleSubmissionEvents;
