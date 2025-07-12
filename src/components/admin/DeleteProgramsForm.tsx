'use client'
interface DeleteProps {
    // confirmDelete: () => void
    handleConfirm: () => void 
    handleCancel: () => void
    title: string
}

const DeleteProgramsForm = ({ handleConfirm, handleCancel, title }: DeleteProps) => {
  return (
    <div>
      <h1>{title}</h1>
        <p>Are you sure you want to delete this program?</p>
        <button onClick={handleConfirm}>Yes</button>
        <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default DeleteProgramsForm