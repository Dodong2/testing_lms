// connected to backend — evaluation notification
interface EvalData {
    email: string
    programName: string
}

export const sendEval = async ({
    email,
    programName
}: EvalData) => {
    try {
        const subject = `📊 New Evaluation Submitted for "${programName}"`

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
         <div style="text-align: center; margin-bottom: 20px;">
        <img src="" 
             alt="EduLink Logo" 
             style="max-width: 150px; height: auto;">
    </div>
            <h2>New Evaluation Received</h2>
            <p>A participant has submitted an evaluation for the program <strong>${programName}</strong>.</p>
            <p>Please log in to your account to review the feedback.</p>
            <p style="color: gray; font-size: 12px;">This is an automated notification. Please do not reply.</p>
        </div>
        `

        await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: email, subject, htmlContent }),
        })
    } catch (error) {
        console.error('❌ Failed to send evaluation email:', error)
    }
}
