import Image from "next/image"
/* components */
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
            <h1 className="text-2xl font-bold italic text-[#EFEFEF]">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 items-start">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-[#00306E] p-1 gap-2 rounded-2xl border border-transparent hover:border-gray-100 transition shadow-md">
                        <Image src="/Analyze.png" alt='logo' width={100} height={100} />
                        <div>
                            
                            <p className="text-sm text-gray-300">
                               “Quick overview of programs, user roles, uploads, and recent activity within the system.”
                            </p>
                        </div>
                    </div>

                    <ProgramCountCard className="h-[100px]" />
                    <LatestProgram />
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
            
            {/* Monthly User Registrations */}
            <div className="p-2">
                <ChartUserRegistrations />
            </div>
            <div className="p-2">
                <PostsPerMonthChart />
            </div>

        </div>
    )
}