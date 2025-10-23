import { User } from "@prisma/client";
import { apiFetch } from "./apiClient";

export interface UserRegisterStats {
    month: string
    total: number
    admin: number
    instructor: number
    beneficiary: number
}

export const getUserRegisterStats = (): Promise<UserRegisterStats[]> =>{
    return apiFetch<UserRegisterStats[]>("/api/stats/user-registrations")
}