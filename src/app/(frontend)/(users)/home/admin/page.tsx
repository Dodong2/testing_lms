// import PushTest from "@/components/PushTest"
import ChartAllUsers from "@/components/charts/ChartAllUsers"
import ProgramCountCard  from "@/components/charts/ProgramCountCard"

export default function Admin() {
    return (
        <div className="p-5 grid gap-8 md:grid-cols-2">
            <h2 className="text-2xl font-bold italic text-[#EFEFEF]">Dashboard</h2>
            {/* <PushTest/> */}
            <ProgramCountCard/>
            <ChartAllUsers/>
        </div>
    )
}