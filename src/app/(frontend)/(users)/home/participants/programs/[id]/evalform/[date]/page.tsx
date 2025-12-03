// import EvaluationLists from "../pages/EvaluationLists"
import dynamic from "next/dynamic"

interface EvaluationDate {
    params: Promise<{
        id: string
        date: string
    }>
}

export default async function EvaluationDatePage({ params }: EvaluationDate) {
    const { id: programId, date } = await params

    const EvaluationLists = dynamic(() => import("../pages/EvaluationLists"))

    return (
        <EvaluationLists programId={programId} date={date} />
    );
}
