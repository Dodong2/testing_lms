export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  BENEFICIARY = 'BENEFICIARY'
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string
}

export interface CreateUserRequest {
  email: string
  name: string
  role: UserRole
}