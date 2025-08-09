import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";

interface FileItemProps {
  name: string;
  url: string;
}

const FileItem: React.FC<FileItemProps> = ({ name, url }) => (
  <li className="flex items-center justify-between py-2 border-b border-gray-200">
    <span className="text-gray-800">{name}</span>
    <a href={url} download className="text-indigo-600 hover:text-indigo-800">
      <FiDownload className="h-5 w-5" />
    </a>
  </li>
);

export default function FilesContent() {
  const [files] = useState([
    { name: "Document 1.pdf", url: "/files/document1.pdf" },
    { name: "Document 2.pdf", url: "/files/document2.pdf" },
    { name: "Document 3.pdf", url: "/files/document3.pdf" },
    { name: "Document 4.pdf", url: "/files/document4.pdf" },
  ]);


  return (
    <>
      <div className="bg-gray-100 p-6 space-y-6 rounded-md shadow mt-3">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Available Files
        </h2>
        <ul>
          {files.map((file, index) => (
            <FileItem key={index} name={file.name} url={file.url} />
          ))}
        </ul>
        {files.length === 0 && (
          <p className="text-gray-500 mt-4">No files available.</p>
        )}
      </div>
    </>
  );
}
