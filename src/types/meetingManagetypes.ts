export interface Meeting {
    id: string;
    title: string;
    link: string;        // GMeet/Zoom link
    startTime: string;   // ISO string (Date.toISOString())
    endTime: string;     // ISO string
    createdBy: string;   // userId ng instructor
    programId: string;   // kung aling program siya naka-attach
}

export interface MeetingPayload {
    title: string
    link: string
    startTime: string
    endTime: string
}