// import PushTest from "@/components/PushTest"
import ChartAllUsers from "@/components/charts/ChartAllUsers"
import ProgramCountCard from "@/components/charts/ProgramCountCard"
import ChartUserRegistrations from "@/components/charts/ChartUserRegistrations"

export default function Admin() {
    return (
    <div>
      <h2 className="text-2xl font-bold italic text-[#EFEFEF] mb-4">Dashboard</h2>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 items-start">
        {/* Small card on the left */}
        <div className="lg:col-span-1">
          <ProgramCountCard className="h-[150px]" />
        </div>

        {/* Large chart taking up 2 columns */}
        <div className="lg:col-span-2">
          <ChartAllUsers />
        </div>
      </div>

      {/* Below section */}
      <div className="p-5 mt-6">
        <ChartUserRegistrations />
      </div>
    </div>
    )
}