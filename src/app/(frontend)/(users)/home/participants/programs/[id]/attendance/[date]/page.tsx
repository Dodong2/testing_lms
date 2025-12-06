// import EvaluationLists from "../pages/EvaluationLists"
import dynamic from "next/dynamic"

interface AttendanceDate {
    params: Promise<{
        id: string
        date: string
    }>
}

export default async function AttendanceDatePage({ params }: AttendanceDate) {
    const { id: programId, date } = await params

    const AttendanceLists = dynamic(() => import("../pages/AttendanceLists"))

    return (
        <AttendanceLists programId={programId} date={date} />
    );
}
