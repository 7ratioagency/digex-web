import { z } from 'zod'

/**
 * Validation copy, injected so the same schema can be built with the visitor's
 * locale on the client and with fixed strings on the server.
 */
export type ContactValidationMessages = {
  nameRequired: string
  emailRequired: string
  emailInvalid: string
  messageRequired: string
  messageTooShort: string
}

export function createContactSchema(m: ContactValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, { message: m.nameRequired }),
    // .min(1) first so an empty field reads "required" rather than "invalid".
    email: z
      .string()
      .trim()
      .min(1, { message: m.emailRequired })
      .pipe(z.email({ message: m.emailInvalid })),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    message: z.string().trim().min(10, { message: m.messageTooShort }),
    /**
     * Honeypot. Hidden from real users, so anything here means a bot.
     *
     * Deliberately permissive: if the schema rejected a filled value the
     * request would 400, telling the bot it was caught. Instead it parses
     * cleanly and the route handler drops it while returning 200.
     */
    company: z.string().optional(),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>

/**
 * Server-side guard. Never trust the client's own validation — but these
 * strings are never surfaced, the route returns a generic 400 instead.
 */
export const serverContactSchema = createContactSchema({
  nameRequired: 'name',
  emailRequired: 'email',
  emailInvalid: 'email',
  messageRequired: 'message',
  messageTooShort: 'message',
})
