"use client";
/* hooks */
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChatSquareTextFill } from "react-icons/bs";

/* contents for posts */
const posts = [
  {
    comments: [
      {
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        icon: <BsChatSquareTextFill />,
      },
    ],
  },
];

const Comments = () => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="p-1 rounded-md w-full bg-white"></div>
      {/* button comments */}
      {posts.map((post, index) => (
        <div key={index}>
          {post.comments &&
            post.comments.length > 0 &&
            post.comments.map((comment, index) => (
              <div key={index}>
                <button
                  onClick={() => setShowComments((prev) => !prev)}
                  className="bg-gray-300 flex items-center justify-center gap-2 p-2 rounded-md hover:bg-gray-500 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="text-2xl">{comment.icon}</span>
                  <span className="text-1xl font-mono">view comments</span>
                </button>
              </div>
            ))}
        </div>
      ))}
      {/* comments */}
      {showComments && (
        <div className="flex items-center gap-2 mt-4">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <input
            type="text"
            placeholder="Add Comment"
            className="flex-1 p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button className="text-gray-600 hover:text-gray-800 active:scale-95 transition-transform">
            <FiSend />
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
