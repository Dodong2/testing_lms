export interface JoinRequestUser {
    id: string
    name: string
    email: string
}

export interface JoinRequest {
    id: string
    programId: string
    user: JoinRequestUser
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
}