// set up ito pang send ng email

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { to, subject, htmlContent } = await req.json()

    console.log('Sending email to:', to)
    console.log('Subject:', subject)
    console.log('HTML content:', htmlContent)

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'My LMS',
          email: 'carlseighartaliode@gmail.com', // dapat verified sa Brevo
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Brevo responded with error:', responseData)
      return NextResponse.json({ error: responseData }, { status: 500 })
    }

    console.log('Brevo success:', responseData)
    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (err) {
    console.error('❌ Server error in /api/send-email:', err)
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
