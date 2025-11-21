"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlefeedbackEvents = void 0;
const handlefeedbackEvents = (io, type, payload) => {
    switch (type) {
        case "feedback-created":
            io.emit('feedback-created', payload);
            break;
        default:
            console.log("Unknown feedback event type");
    }
};
exports.handlefeedbackEvents = handlefeedbackEvents;
