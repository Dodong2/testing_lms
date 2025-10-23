// import PushTest from "@/components/PushTest"
import ChartAllUsers from "@/components/charts/ChartAllUsers"
import ProgramCountCard from "@/components/charts/ProgramCountCard"
import ChartUserRegistrations from "@/components/charts/ChartUserRegistrations"
import ChartFiles from "@/components/charts/ChartFiles"
import PostsPerMonthChart from "@/components/charts/PostsPerMonthChart"

export default function Admin() {
    return (
    <div>
            <h2 className="text-2xl font-bold italic text-[#EFEFEF] mb-2">Dashboard</h2>

            {/* Top Section */}
            {/* Binago ang grid: Isang row na may 3 pantay na columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 items-start"> 
                
                {/* 1. User Roles Distribution */}
                <div className="md:col-span-1">
                    <ChartAllUsers />
                </div>

                {/* 2. Files Chart */}
                <div className="md:col-span-1">
                    <ChartFiles />
                </div>

                {/* 3. Program Count at Meeting Scheduled - Gagamit ng 2 rows sa loob ng 1 column */}
                <div className="md:col-span-1 flex flex-col gap-4"> 
                    <ProgramCountCard className="h-[100px]" /> {/* Inayos ang height para maging mas maliit */}
                    
                </div>
            </div>

            {/* Below section */}
            <div className="p-5 mt-6">
                <ChartUserRegistrations />
            </div>
            <div  className="p-5 mt-6">
                <PostsPerMonthChart/>
            </div>
        </div>
    )
}