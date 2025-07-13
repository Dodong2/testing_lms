// types for get user in useUsersLists hooks
export interface usersLists {
    id: string
    name:string
    email: string
    role: string
}

//type for update in services
export interface UpdateUsersData {
    UserId: string
    data: {
        name: string
        email: string
        role: string
    }
}

export interface UpdateUsersProps {
    UserId: string
    initialData: {
        name: string
        email: string
        role: string
    }
    onSuccess: () => void
}

//types for DeleteUserModal components
export interface DeleteUserModalProps {
  userName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}