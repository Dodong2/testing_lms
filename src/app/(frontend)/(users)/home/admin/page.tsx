// import PushTest from "@/components/PushTest"
import ChartAllUsers from "@/components/charts/ChartAllUsers"
export default function Admin() {
    return (
        <div className="p-6 grid gap-8 md:grid-cols-2">
            Admin Page
            {/* <PushTest/> */}
            <ChartAllUsers/>
        </div>
    )
}