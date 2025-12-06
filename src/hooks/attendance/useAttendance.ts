import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAttendance, getAttendanceByDate, getAttendanceDates } from "@/services/attendanceServices"
import { CreateAttendanceInput, AttendanceEntry } from "@/types/attendanceManagetypes"

export const useAttendance = () => {
    const queryClient = useQueryClient()

    // create attendance
    const useCreateAttendance = () => {
        return useMutation({
            mutationFn: (data: CreateAttendanceInput) => createAttendance(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["attendances"] }),
                    queryClient.invalidateQueries({ queryKey: ["attendance-dates"] })
            }
        })
    }

    // Get attendance dates for a program
    const useAttendanceDates = (programId: string) => {
        return useQuery({
            queryKey: ["attendance-dates", programId],
            queryFn: () => getAttendanceDates(programId)
        })
    }

    // Get attendances by date
    const useAttendancesByDate = (programId: string, date: string) => {
        return useQuery<AttendanceEntry[]>({
            queryKey: ["attendances-by-date", programId, date],
            queryFn: () => getAttendanceByDate(programId, date)
        })
    }

    return { useCreateAttendance, useAttendanceDates, useAttendancesByDate }
}
