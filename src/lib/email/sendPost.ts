// connected to backend — new post notification
interface PostData {
    post?: "ANNOUNCEMENT" | "TASK" | "NORMAL"
    email: string
    programName: string
}

export const sendPost = async ({
    post,
    email,
    programName
}: PostData) => {
    try {
        const subject = `📢 New "${post}" in "${programName}"`

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>New Program Update</h2>
        <p>A new post has been published in the program <strong>${programName}</strong>.</p>
        <p>Please log in to your account to view the latest update.</p>
        <p style="color: gray; font-size: 12px;">This is an automated notification. Please do not reply.</p>
      </div>
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
