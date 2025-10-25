import { useState } from "react"

interface PostProps {
    content: string
}


const PostsContent = ({ content }: PostProps) => {
    const [expanded, setExpanded] = useState(false)
    const MAX_LENGTH = 230
    const isLong = content.length > MAX_LENGTH
    const displayText = expanded ? content : content.slice(0, MAX_LENGTH)

    return (
        <div className="mb-1">
            <div className="text-sm text-[#E9E9E9] whitespace-pre-wrap">
                {displayText}
                {!expanded && isLong && "..."}
                {/* Toggle button kung mahaba */}
                {isLong && (
                    <span
                        onClick={() => setExpanded((prev) => !prev)}
                        className="text-sm hover:underline mt-1 cursor-pointer hover:text-blue-500"
                    >
                        {expanded ? "..See less" : "See more"}
                    </span>
                )}
            </div>


        </div>
    )
}

export default PostsContent