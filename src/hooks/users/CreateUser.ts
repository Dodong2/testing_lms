import { useState } from "react"
import { useUsers } from "./useUsers"
import { CreateUserData } from "@/types/usersManagetypes"

export const CreateUser = ({ onSuccess }: {onSuccess: () => void}) => {
    const { mutate: createUser, isPending } = useUsers().useCreateUser()
    const [formData, setFormData] = useState<CreateUserData>({
        email: '',
        name: '',
        role: 'BENEFICIARY',
    })

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault()

        createUser(formData, {
            onSuccess: () => {
                onSuccess()
            }
        })
    }

    return { formData, setFormData, handleCreateUser, isPending }
}
