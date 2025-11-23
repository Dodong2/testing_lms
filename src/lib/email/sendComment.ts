// connected to backend — new post notification
interface CommentData {
    postTitle: string
    email: string
    programName: string
}

export const sendComment = async ({
    postTitle,
    email,
    programName
}: CommentData) => {
    try {
        const subject = `📢 New comment on your "${postTitle}"`

        const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Comment Received</h2>
        <p>A new comment has been added to your post <strong>${postTitle}</strong> in the program <strong>${programName}</strong>.</p>
        <p>Please log in to your account to view and respond to the comment.</p>
        <p style="color: gray; font-size: 12px;">This is an automated notification. Please do not reply.</p>
    `

        await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: email, subject, htmlContent }),
        })
    } catch (error) {
        console.error('❌ Failed to send new post email:', error)
    }
}
