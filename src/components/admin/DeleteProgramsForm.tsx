'use client'
interface DeleteProps {
    // confirmDelete: () => void
    handleConfirm: () => void 
    handleCancel: () => void  
}

const DeleteProgramsForm = ({ handleConfirm, handleCancel }: DeleteProps) => {
  return (
    <div>
        <p>Are you sure you want to delete this program?</p>
        <button onClick={handleConfirm}>Yes</button>
        <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default DeleteProgramsForm