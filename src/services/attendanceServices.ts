import { apiFetch } from "./apiClient";
import { CreateAttendanceInput, AttendanceEntry, AttendanceStats } from "@/types/attendanceManagetypes";

// create attendance
export const createAttendance = async (data: CreateAttendanceInput): Promise<AttendanceEntry> => {
    return apiFetch('/api/attendance', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

// Get attendance dates for a program
export const getAttendanceDates = async (programId: string): Promise<{ date: string }[]> => {
    return apiFetch(`/api/program/${programId}/attendance/dates`)
}

// Get attendances by date
export const getAttendanceByDate = async (programId: string, date: string): Promise<AttendanceEntry[]> => {
    return apiFetch(`/api/program/${programId}/attendance/${date}`)
}

