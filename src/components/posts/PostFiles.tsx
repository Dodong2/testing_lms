import { FiDownload } from "react-icons/fi";
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";

interface PostFileProps {
  name: string;
  url: string;
  onClick?: (file: { name: string; url: string }) => void; // 👈 dagdag
}

const PostFiles = ({ name, url, onClick }: PostFileProps) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLocaleLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="text-red-500 w-5 h-5" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 w-5 h-5" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="text-orange-500 w-5 h-5" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="text-green-500 w-5 h-5" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className="text-purple-500 w-5 h-5" />;
      default:
        return <FaFileAlt className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div
      className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm cursor-pointer hover:bg-amber-200"
      onClick={() => onClick?.({ name, url })} // 👈 kapag click → trigger modal
    >
      <div className="flex items-center gap-2">
        {getFileIcon(name)}
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        onClick={(e) => e.stopPropagation()} // 👈 para di ma-trigger modal pag download
      >
        View
      </a>
    </div>
  );
};

export default PostFiles;
