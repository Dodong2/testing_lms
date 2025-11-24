interface DeadlineNotifData {
    postTitle: string
    deadline: Date
    email: string
    programName: string
}

export const sendDeadlineNotif = async ({
    postTitle,
    deadline,
    email,
    programName
}: DeadlineNotifData) => {
    try {
        const deadlineStr = deadline.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        const subject = `⏰ Task Deadline Reminder: "${postTitle}"`

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Task Deadline Reminder</h2>
        <p>A task in <strong>${programName}</strong> is due soon.</p>
        <p><strong>Task:</strong> ${postTitle}</p>
        <p><strong>Due Date:</strong> ${deadlineStr}</p>
        <p style="color: #d9534f; font-weight: bold;">Please complete it before the deadline!</p>
        <p style="color: gray; font-size: 12px;">This is an automated notification. Please do not reply.</p>
      </div>
    `

        await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: email, subject, htmlContent }),
        })
    } catch (error) {
        console.error('❌ Failed to send deadline notification:', error)
    }
}
