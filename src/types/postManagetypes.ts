export interface PostGetTypes {
    id: string,
    content: string
    authorId: string
    programId: string
    createdAt: string
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