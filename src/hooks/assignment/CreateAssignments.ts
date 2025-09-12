import { useState } from "react";
import { useAssignment } from "./useAssignment";

interface FormData {
  title: string;
  description: string;
  dueDate: string;
}

export const CreateAssignment = ({
  programId,
  onSuccess,
}: {
  programId: string;
  onSuccess: () => void;
}) => {
  const { mutate: createAssignment, isPending } = useAssignment().useCreateAssignment(programId);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();

    createAssignment(
      {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
      },
      { onSuccess }
    );
  };

  return { formData, setFormData, handleCreateAssignment, isPending };
};
