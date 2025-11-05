"use client";
import { UpdateUsers } from "@/hooks/users/UpdateUser";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface EditUserModalProps {
  UserId: string;
  initialData: {
    name: string;
    email: string;
    role: string;
  };
  onClose: () => void;
  onSuccess: () => void;
  programs: ProgramMembership[];
}

type ProgramMembership = {
  program: {
    id: string;
    title: string;
  };
};

const EditUserModal = ({
  UserId,
  initialData,
  onClose,
  onSuccess,
  programs,
}: EditUserModalProps) => {
  const { formData, handleChange, handleSubmit, isPending } = UpdateUsers({
    UserId,
    initialData,
    onSuccess,
  });

  useLockBodyScroll(true)

  return (
    <div
      className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(70, 70, 70, 0.3)" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full relative">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Edit User
        </h2>

        {/* Ginawa kong isang form ang buong content para kasama ang buttons */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT SIDE: Input Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                User Details
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                {/* role */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="BENEFICIARY">Beneficiary</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* RIGHT SIDE: Program Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Assigned Programs
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px]">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {programs.length > 0 ? (
                    programs.map(({ program }) => (
                      <li key={program.id}>{program.title}</li>
                    ))
                  ) : (
                    <li className="italic text-gray-400">
                      No assigned programs
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* BOTTOM: Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95 transition-transform"            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
