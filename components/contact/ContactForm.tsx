'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { createContactSchema, type ContactFormValues } from '@/lib/contact-schema'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const fieldClasses =
  'mt-1 block min-h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-base text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue'

export function ContactForm() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<Status>('idle')

  const schema = createContactSchema({
    nameRequired: t('validation.nameRequired'),
    emailRequired: t('validation.emailRequired'),
    emailInvalid: t('validation.emailInvalid'),
    messageRequired: t('validation.messageRequired'),
    messageTooShort: t('validation.messageTooShort'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    // Validate on blur, not on every keystroke.
    mode: 'onTouched',
  })

  async function onSubmit(values: ContactFormValues) {
    setStatus('submitting')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error('request failed')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 className="text-lg font-semibold">{t('formTitle')}</h3>

      <div className="mt-section-md grid grid-cols-1 gap-section-sm sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClasses}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-sm text-accent-rose">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            // type=email brings up the right mobile keyboard.
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder={t('emailPlaceholder')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClasses}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-accent-rose">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {t('phoneLabel')}{' '}
            <span className="font-normal text-muted-foreground">
              ({t('phoneOptional')})
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder={t('phonePlaceholder')}
            className={fieldClasses}
            {...register('phone')}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium">
            {t('messageLabel')}
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder={t('messagePlaceholder')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`${fieldClasses} min-h-32 resize-y leading-relaxed`}
            {...register('message')}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1 text-sm text-accent-rose">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot — off-screen and skipped by keyboard/AT, so only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <div className="mt-section-md flex flex-wrap items-center gap-section-sm">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>

        {/* aria-live so the outcome is announced without stealing focus. */}
        <p aria-live="polite" className="text-sm">
          {status === 'success' && (
            <span className="text-accent-cyan">{t('success')}</span>
          )}
          {status === 'error' && (
            <span className="text-accent-rose">{t('error')}</span>
          )}
        </p>
      </div>
    </form>
  )
}
