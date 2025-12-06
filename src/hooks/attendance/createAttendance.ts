import toast from "react-hot-toast"
import { useAttendance } from "./useAttendance"
import { CreateAttendanceInput } from "@/types/attendanceManagetypes"

type UseCreateAttendanceProps = {
    programId: string;
    name: string;
    address: string;
    sex: string;
    contactNumber: string;
    date: string;
    onSuccess?: () => void;
};


export const createAttendance = ({ programId, name, address, sex, contactNumber, date, onSuccess }: UseCreateAttendanceProps) => {
    const { mutateAsync, isPending } = useAttendance().useCreateAttendance()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!programId) {
            toast.error("Program ID is required")
            return
        }

        if (!name || !address || !sex || !contactNumber || !date) {
            toast.error("All fields are required");
            return;
        }

        const payload: CreateAttendanceInput = {
            programId,
            name,
            address,
            sex,
            contactNumber,
            date
        }

        try {
            await toast.promise(mutateAsync(payload), {
                loading: "Submitting attendance...",
                success: "Attendance submitted successfully!",
                error: (err) => err.message || "Failed to submit attendance.",
            })

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Attendance submission error:", error);
        }

    }


    return { handleSubmit, isPending }
}
