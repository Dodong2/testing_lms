export interface PostGetTypes {
  id: string
  content: string
  authorId: string
  programId: string
  createdAt: string
  tag?: "ANNOUNCEMENT" | "TASK" // or string if dynamic
  deadline?: string // ISO string (convert to Date if needed)
  files?: FileMeta[]
  author: {
    id: string
    name: string
    image: string
  }
  comments: {
    id: string
    content: string
    author: {
      id: string
      name: string
      image: string
    }
  }[]
}

// ginamit sa UpdatePostModal
export interface FileMeta {
  name: string;
  url: string;
  type: string;
}

export interface PostPayload {
  content: string;
  files?: FileMeta[];
  deadline?: string; // YYYY-MM-DD
}

// ginamit sa updatePosts services at usePost hooks
export interface UpdatePostTypes {
  content: string 
  files?: FileMeta[]
  deadline?: string
}
// ginamit sa hooks usePost
export interface UpdatePayload {
  postId: string
  payload: UpdatePayload
}