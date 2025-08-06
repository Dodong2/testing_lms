// ito yung ikokonek sa backend remove member
interface ProgramRemovalEmailData {
  email: string
  programName: string
}

export const sendProgramRemovalEmail = async ({
  email,
  programName,
}: ProgramRemovalEmailData) => {
  try {
    const subject = `⚠️ Removed from "${programName}"`
    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello,</h2>
        <p>You have been removed from the program: <strong>${programName}</strong>.</p>
        <p>If you believe this is a mistake, please contact your administrator.</p>
        <p style="color: gray;">Email: ${email}</p>
      </div>
    `

    await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject, htmlContent }),
    })
  } catch (error) {
    console.error('❌ Failed to send removal email:', error)
  }
}