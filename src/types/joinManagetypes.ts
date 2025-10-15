export interface JoinRequestUser {
    id: string
    name: string
    email: string
    role: 'BENEFICIARY' | 'INSTRUCTOR' | 'ADMIN'
    image: string
}

export interface JoinRequest {
    id: string
    programId: string
    user: JoinRequestUser
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
}