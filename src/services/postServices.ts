//get posts
export const getPosts = async (programId: string) => {
    const res = await fetch(`/api/program/${programId}/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    if(!res.ok) {
        throw new Error('Failed to fetch posts')
    }
    return res.json()
}

//create posts
export const createPost = async (programId: string, content: string) => {
    const res = await fetch(`/api/program/${programId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content })
    })

    if(!res.ok) {
        throw new Error('Failed to create post')
    }

    return res.json()
}

//create comment
export const createComment = async(postId: string, content: string) => {
    const res = await fetch(`/api/program/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })

    if(!res.ok) {
        throw new Error('Failed to create comment')
    }

    return res.json()
}