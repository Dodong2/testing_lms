import Brevo from '@getbrevo/brevo'

const brevo = new Brevo.TransactionalEmailsApi()

brevo.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

interface ProgramRemovalEmailData {
    email: string
    programName: string
}

export const sendProgramRemovalEmail = async({ email, programName }: ProgramRemovalEmailData) => {
    try {
        await brevo.sendTransacEmail({
            subject: `⚠️ Removed from "${programName}"`,
            sender: { name: 'LMS Admin', email: 'carlseighartaliode@gmail.com' },
            to: [{ email }],
            htmlContent: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Hello,</h2>
                    <p>You have been removed from the program: <strong>${programName}</strong>.</p>
                    <p>If you believe this is a mistake, please contact your administrator.</p>
                    <p style="color: gray;">Email: ${email}</p>
                </div>
            `
        })
        console.log(`📧 Removal email sent to ${email}`)
    } catch(error) {
        console.error('❌ Failed to send removal email:', error)
    }
}