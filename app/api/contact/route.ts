import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { serverContactSchema } from '@/lib/contact-schema'
import { contactDetails } from '@/content/services'

/** Where enquiries land. Single source of truth in content/services.ts. */
const TO_ADDRESS = contactDetails.email

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const parsed = serverContactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const { name, email, phone, message, company } = parsed.data

  // Honeypot tripped — accept silently so the bot gets no signal, send nothing.
  if (company) {
    return NextResponse.json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !fromAddress) {
    console.error(
      'Contact form: RESEND_API_KEY and CONTACT_FROM_EMAIL must both be set.',
    )
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: TO_ADDRESS,
    // Lets the team hit reply and reach the enquirer directly.
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '—'}`,
      '',
      message,
    ].join('\n'),
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>`,
      `<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
    ].join(''),
  })

  if (error) {
    console.error('Contact form: Resend rejected the message.', error)
    return NextResponse.json({ error: 'send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
