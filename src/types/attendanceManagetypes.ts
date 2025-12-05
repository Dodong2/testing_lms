export type CreateAttendanceInput = {
    programId: string;
    name: string;
    address: string;
    sex: string;
    contactNumber: string;
    date: string;
};

export type AttendanceEntry = {
    id: string;
    name: string;
    address: string;
    sex: string;
    contactNumber: string;
    date: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    };
};

export type AttendanceStats = {
    totalAttendees: number;
    maleCount: number;
    femaleCount: number;
    otherCount: number;
};