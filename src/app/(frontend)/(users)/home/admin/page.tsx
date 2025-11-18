// import PushTest from "@/components/PushTest"
import ChartAllUsers from "@/components/charts/ChartAllUsers"
import ProgramCountCard from "@/components/charts/ProgramCountCard"
import ChartUserRegistrations from "@/components/charts/ChartUserRegistrations"
import ChartFiles from "@/components/charts/ChartFiles"
import PostsPerMonthChart from "@/components/charts/PostsPerMonthChart"
import MostActivePrograms from "@/components/charts/MostActivePrograms"
import LatestProgram from "@/components/charts/LatestProgram"

export default function Admin() {
    return (
        <div>
            <h2 className="text-2xl font-bold italic text-[#EFEFEF] mb-2">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 items-start">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <ProgramCountCard className="h-[100px]" />
                    <LatestProgram/>
                </div>

                <div className="md:col-span-1">
                    <ChartAllUsers />
                </div>

                <div className="md:col-span-1">
                    <ChartFiles />
                </div>                
            </div>

            {/* Below section */}
            <div className="p-2">
                <MostActivePrograms />
            </div>
            <div className="p-2">
                <ChartUserRegistrations />
            </div>
            <div className="p-2">
                <PostsPerMonthChart />
            </div>
            
        </div>
    )
}