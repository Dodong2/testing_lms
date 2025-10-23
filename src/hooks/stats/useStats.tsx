import { useQuery } from "@tanstack/react-query";
import { getUserRegisterStats, UserRegisterStats } from "@/services/statsServices";

export const useStats = () => {
    
    const userUserRegistrations = () => {
        return useQuery<UserRegisterStats[]>({
            queryKey: ["user-registration-stats"],
            queryFn: getUserRegisterStats,
        })
    }
    
    return { userUserRegistrations }
}