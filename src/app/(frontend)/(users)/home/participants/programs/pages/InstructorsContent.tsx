import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface InstructorItemProps {
  name: string;
}

const InstructorItem: React.FC<InstructorItemProps> = ({ name }) => (
  <li className="flex items-center py-2">
    <FaUserCircle className="h-5 w-5 mr-2 text-gray-500" />
    <span className="text-gray-800">{name}</span>
  </li>
);

export default function InstructorsContent() {
  const instructors = [
    { name: 'Instructor #1' },
    { name: 'Instructor #2' },
    { name: 'Instructor #3' },
    { name: 'Instructor #4' },
    { name: 'Instructor #5' },
  ];

  return (
    <div className="bg-gray-100 space-y-6 rounded-md shadow mt-3 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructors</h2>
      <ul>
        {instructors.map((instructor, index) => (
          <InstructorItem key={index} name={instructor.name} />
        ))}
      </ul>
    </div>
  );
}