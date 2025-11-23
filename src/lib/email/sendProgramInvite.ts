// ito yung ikokonek sa backend add member
interface ProgramInviteEmailData {
  email: string
  name: string
  programName: string
  role: 'BENEFICIARY' | 'INSTRUCTOR' | 'ADMIN'
}

export const sendProgramInviteEmail = async ({
  email,
  name,
  programName,
  role,
}: ProgramInviteEmailData) => {
  try {
    const subject = `You've been added to a program!`
    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>You have been added to the program <strong>${programName}</strong> as a <strong>${role}</strong>.</p>
        <p>Please log in to your LMS account to get started.</p><br>
        <p>— EduLink Team</p>
      </div>
    `

    await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject, htmlContent }),
    })
  } catch (error) {
    console.error('❌ Failed to send invite email:', error)
  }
}
