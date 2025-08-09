"use client";
/* components */
import Comments from '@/components/Comments';
/* icons */
import { FiDownload } from 'react-icons/fi';


/* contents for posts */
 const posts = [
  {
    id: 1,
    author: "hv",
    posted: "Posted:",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate ante non sem finibus porttitor. Sed eget finibus nibh. Aliquam erat volutpat. Nam vestibulum nulla justo, eget elementum magna tincidunt et. Fusce interdum, diam quis dignissim ultricies, tellus elit cursus orci, in ullamcorper neque odio venenatis nunc. Quisque vel sapien diam. Praesent luctus convallis dictum.\n\nQuisque id ligula at neque faucibus imperdiet. Suspendisse euismod porta tellus, dignissim rhoncus massa efficitur eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed vel magna at massa venenatis tincidunt. Maecenas convallis posuere elit eget faucibus.",

    files: [
      { name: "4Ps Guidelines.pdf", size: "2.58 MB", type: "PDF", icon: <FiDownload/> },
      { name: "4Ps members.doc", size: "1.38 MB", type: "DOC", icon: <FiDownload/> },
    ],
  },
];

export default function UpdatesContent() {
  return (
  <>
    <div className="w-full">
  <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 items-start">
    {/* Main content - LEFT SIDE */}
    <div className="bg-white rounded-md overflow-hidden">
      

      {/* Post input area */}
      <div className="p-2 bg-gray-100 mt-2 rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <input
            type="text"
            placeholder="Post Something / Create a discussions"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
          />
          <button className="bg-gray-800 text-white px-3 py-2 rounded text-sm sm:text-base whitespace-nowrap">
            Publish
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className=" bg-gray-100 p-4 space-y-6 rounded-md shadow mt-3">
        {posts.map(post => (
          <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-semibold text-gray-800">{post.author}</p>
                  <p className="text-xs text-gray-500">{post.posted}</p>
                </div>
              </div>
              <div className="text-gray-500 cursor-pointer">...</div>
            </div>

            {/* Post Content */}
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* File Attachments */}
            {post.files && post.files.length > 0 && (
              <div className="space-y-2 mb-4">
                {post.files.map((file, fileIdx) => (
                  <div key={fileIdx} className="flex items-center justify-between bg-white p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs text-gray-700 rounded">
                        {file.type}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="text-gray-600 hover:text-gray-800">{file.icon}</button>
                  </div>
                ))}
              </div>
            )}

            {/* Comments */}
            <Comments/>

          </div>
        ))}
      </div>
    </div>

  </div>
</div>

  </>
  )
}