import { CreateUserRequest, User } from '@/types/auth'

export const userService = {
  async createUser(userData: CreateUserRequest): Promise<{ user: User; message: string }> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create user')
    }

    return response.json()
  },

  async getUsers(): Promise<{ users: User[] }> {
    const response = await fetch('/api/users')
    
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    return response.json()
  }
}