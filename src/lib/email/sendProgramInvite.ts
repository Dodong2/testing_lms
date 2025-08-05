import Brevo from '@getbrevo/brevo'

const brevo = new Brevo.TransactionalEmailsApi()

brevo.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

interface ProgramInviteEmailData {
    email: string
    name: string
    programName: string
    role: 'BENEFICIARY' | 'INSTRUCTOR' | 'ADMIN'
}

export const sendProgramInviteEmail = async({ email, name, programName, role }: ProgramInviteEmailData) => {
    try {
        await brevo.sendTransacEmail({
            subject: `You've been added to a program!`,
            sender: { name: 'LMS Admin', email: 'carlseighartaliode@gmail.com' },
            to: [{ email, name }],
            htmlContent: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Hello ${name},</h2>
                    <p>You have been added to the program <strong>${programName}</strong> as a <strong>${role}</strong>.</p>
                    <p>Please log in to your LMS account to get started.</p><br>
                    <p>— LMS Team</p>
                </div>
            `
        })
        console.log(`📧 Email sent to ${email}`)
    } catch(error) {
        console.error('❌ Failed to send email:', error)
    }
}