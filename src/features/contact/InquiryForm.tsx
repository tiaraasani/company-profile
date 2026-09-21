import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CircleAlert, LoaderCircle, Send } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createInquiry } from './inquiryApi'
import {
  EMPTY_INQUIRY_VALUES,
  INQUIRY_SUBJECTS,
  inquirySchema,
  type InquiryFormValues,
} from './inquirySchema'
import { FormErrorSummary } from '@/components/shared/FormErrorSummary'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { company } from '@/data/company'
import { isBackendlessConfigured, NetworkError } from '@/lib/backendless'
import { cn } from '@/lib/utils'

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; name: string; via: 'backendless' | 'mailto' }
  | { kind: 'error'; message: string }

const FIELD_LABELS: Record<keyof InquiryFormValues, string> = {
  subject: 'Subject',
  name: 'Name',
  company: 'Company/Institution',
  email: 'Work Email',
  phone: 'Mobile Phone Number',
  country: 'Country',
  message: 'Message',
  website: 'Website',
}

/** Same look as the Input component, for the one native <select> on the site. */
const SELECT_CLASS =
  'h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

function mailtoHref(values: InquiryFormValues): string {
  const body = [
    values.message,
    '',
    `${values.name}, ${values.company} (${values.country})`,
    `${values.email}, ${values.phone}`,
  ].join('\n')
  return `mailto:${company.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`
}

/**
 * "Let's Talk About Business": the same fields as the original contact form. Submissions
 * go to the Backendless `Inquiries` table; when Backendless is not configured the
 * visitor's email app opens with the message prefilled.
 */
export function InquiryForm() {
  const baseId = useId()
  const ids = Object.fromEntries(
    (Object.keys(FIELD_LABELS) as (keyof InquiryFormValues)[]).map((key) => [key, `${baseId}-${key}`]),
  ) as Record<keyof InquiryFormValues, string>
  const summaryId = `${baseId}-summary`

  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const summaryRef = useRef<HTMLDivElement>(null)

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: 'onBlur',
    defaultValues: EMPTY_INQUIRY_VALUES,
  })
  const { errors, submitCount } = form.formState
  const errorEntries = (Object.keys(errors) as (keyof InquiryFormValues)[])
    .filter((key) => key !== 'website' && errors[key]?.message)
    .map((key) => ({ key, message: errors[key]?.message ?? '' }))

  // After a failed submit, move focus to the error summary (WCAG: focus management).
  useEffect(() => {
    if (submitCount > 0 && errorEntries.length > 0) summaryRef.current?.focus()
    // Only re-run when a new submit attempt happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  const onSubmit = async (values: InquiryFormValues) => {
    // Honeypot filled: quietly behave like a success without sending anything.
    if (values.website) {
      setStatus({ kind: 'success', name: values.name, via: 'backendless' })
      form.reset(EMPTY_INQUIRY_VALUES)
      return
    }

    if (!isBackendlessConfigured) {
      window.location.assign(mailtoHref(values))
      setStatus({ kind: 'success', name: values.name, via: 'mailto' })
      form.reset(EMPTY_INQUIRY_VALUES)
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      await createInquiry({
        subject: values.subject,
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        country: values.country,
        message: values.message,
      })
      setStatus({ kind: 'success', name: values.name, via: 'backendless' })
      form.reset(EMPTY_INQUIRY_VALUES)
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof NetworkError
            ? "We couldn't reach the server. Check your connection and try again."
            : 'Something went wrong while sending your request. Please try again or email us directly.',
      })
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
        <output className="sr-only">Request sent. Thanks, {status.name}.</output>
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check aria-hidden="true" className="size-6" />
        </span>
        <h3 className="text-xl font-semibold">Thanks, {status.name}!</h3>
        <p className="text-muted-foreground">
          {status.via === 'mailto'
            ? `Your email app should have opened with the request prefilled. If it did not, email us at ${company.email}.`
            : 'Your request is on its way. We usually reply within two working days.'}
        </p>
        <Button type="button" variant="outline" className="h-11 px-5" onClick={() => setStatus({ kind: 'idle' })}>
          Send another request
        </Button>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'

  const textField = (
    key: Exclude<keyof InquiryFormValues, 'subject' | 'message' | 'website'>,
    props: { type?: string; inputMode?: 'email' | 'tel' | 'text'; autoComplete: string },
  ) => (
    <Controller
      name={key}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={ids[key]}>{FIELD_LABELS[key]}</FieldLabel>
          <Input
            {...field}
            id={ids[key]}
            type={props.type ?? 'text'}
            inputMode={props.inputMode}
            autoComplete={props.autoComplete}
            aria-required="true"
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.invalid ? `${ids[key]}-error` : undefined}
            className="h-11"
          />
          {fieldState.invalid && <FieldError id={`${ids[key]}-error`} errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10 md:p-8"
    >
      <p className="text-sm text-muted-foreground">All fields are required.</p>

      {submitCount > 0 && errorEntries.length > 0 && (
        <FormErrorSummary
          ref={summaryRef}
          headingId={summaryId}
          title="Please fix the following before sending"
          items={errorEntries.map((entry) => ({
            id: entry.key,
            href: `#${ids[entry.key]}`,
            label: FIELD_LABELS[entry.key],
            message: entry.message,
          }))}
        />
      )}

      {status.kind === 'error' && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert aria-hidden="true" className="size-4 text-destructive" />
            Request not sent
          </p>
          <p className="mt-1">
            {status.message}{' '}
            <a href={`mailto:${company.email}`} className="underline underline-offset-4">
              Email us directly
            </a>
            .
          </p>
        </div>
      )}

      <FieldGroup>
        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.subject}>{FIELD_LABELS.subject}</FieldLabel>
              <select
                {...field}
                id={ids.subject}
                aria-required="true"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${ids.subject}-error` : undefined}
                className={cn(SELECT_CLASS)}
              >
                {INQUIRY_SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError id={`${ids.subject}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {textField('name', { autoComplete: 'name' })}
          {textField('company', { autoComplete: 'organization' })}
          {textField('email', { type: 'email', inputMode: 'email', autoComplete: 'email' })}
          {textField('phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
        </div>

        {textField('country', { autoComplete: 'country-name' })}

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.message}>{FIELD_LABELS.message}</FieldLabel>
              <Textarea
                {...field}
                id={ids.message}
                rows={6}
                aria-required="true"
                aria-invalid={fieldState.invalid}
                aria-describedby={`${ids.message}-help${fieldState.invalid ? ` ${ids.message}-error` : ''}`}
                className="min-h-36"
              />
              <FieldDescription id={`${ids.message}-help`}>
                Up to 500 characters. Tell us about the initiative, the timeline and what success looks like.
              </FieldDescription>
              {fieldState.invalid && <FieldError id={`${ids.message}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Honeypot: visually hidden and skipped by keyboard; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={ids.website}>Website</label>
        <input {...form.register('website')} id={ids.website} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" className="h-11 self-start px-6 text-base" disabled={submitting} aria-busy={submitting}>
        {submitting ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <Send aria-hidden="true" className="size-4" />
        )}
        {submitting ? 'Sending' : 'Send Request'}
      </Button>
    </form>
  )
}
