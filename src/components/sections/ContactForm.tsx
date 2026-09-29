import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import { FormCta } from '@/components/ui/FormCta'
import { TextArea, TextField } from '@/components/ui/TextField'
import { contactPage } from '@/data/contactPage'
import { cn } from '@/lib/cn'

/*
 * Contact form with the Webflow site's fields (Name, Email, Contact No, Message) plus a document
 * attachment, used by the "Get in touch" section and the Contact us page.
 *
 * Submissions go to FormSubmit (formsubmit.co), which emails them — with the document attached — to
 * contactPage.recipient. FormSubmit only accepts files from a regular (non-AJAX) multipart POST, so the
 * browser posts the form and FormSubmit redirects back to this page with ?sent=1 (the `_next` field),
 * where the success message is shown. The very first submission triggers a one-time activation email
 * to the recipient; nothing is delivered until that link is clicked. After that, set contactPage.formId
 * (the random string from the activation email) so the address isn't in the page.
 *
 * Fields are checked here, not by the browser's bubbles: each gets its own message under it (on
 * leaving a field, and for every field on submit, which focuses the first one that needs fixing).
 */
const endpoint = `https://formsubmit.co/${contactPage.formId || contactPage.recipient}`

type FieldName = 'name' | 'email' | 'contact' | 'message'
const FIELDS: FieldName[] = ['name', 'email', 'contact', 'message']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/* Digits with optional +, spaces, dashes, dots and brackets; 7–15 digits (the E.164 limit). */
const PHONE = /^\+?[\d\s().-]+$/

/** The message for a field's value, or '' when it is fine. */
function validate(field: FieldName, raw: string): string {
  const value = raw.trim()
  const { errors } = contactPage
  switch (field) {
    case 'name':
      return value ? '' : errors.name
    case 'email':
      if (!value) return errors.email
      return EMAIL.test(value) ? '' : errors.emailInvalid
    case 'contact': {
      if (!value) return errors.contact
      const digits = value.replace(/\D/g, '').length
      return PHONE.test(value) && digits >= 7 && digits <= 15 ? '' : errors.contactInvalid
    }
    case 'message':
      if (!value) return errors.message
      return value.length >= 10 ? '' : errors.messageShort
  }
}
const SENT_PARAM = 'sent'

export function ContactForm({
  className,
  messageHeight,
}: {
  className?: string
  messageHeight: string
}) {
  const [name, email, phone] = contactPage.fields
  const { attachment } = contactPage
  const formRef = useRef<HTMLFormElement>(null)
  const nextRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileId = useId()
  const fileErrorId = useId()
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})

  const control = (field: FieldName) =>
    formRef.current?.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | null

  /* Leaving a field checks it (only once something was typed, so tabbing through stays quiet). */
  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.target.name as FieldName
    if (!event.target.value && !errors[field]) return
    setErrors((prev) => ({ ...prev, [field]: validate(field, event.target.value) }))
  }

  /* A field with a message is re-checked as it is corrected, so the message goes away at once. */
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.target.name as FieldName
    if (!errors[field]) return
    setErrors((prev) => ({ ...prev, [field]: validate(field, event.target.value) }))
  }

  /* Back from FormSubmit: show the confirmation and drop ?sent=1 so a reload doesn't repeat it. */
  useEffect(() => {
    const url = new URL(window.location.href)
    if (!url.searchParams.has(SENT_PARAM)) return
    url.searchParams.delete(SENT_PARAM)
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration (prerendered HTML has no message)
    setSent(true)
  }, [])

  /* The browser may restore the page from the back/forward cache with the form still "sending". */
  useEffect(() => {
    const onShow = () => setSending(false)
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setFileName(file?.name ?? '')
    setFileError(file && file.size > attachment.maxBytes ? attachment.tooLarge : '')
  }

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFileName('')
    setFileError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const next = Object.fromEntries(
      FIELDS.map((field) => [field, validate(field, control(field)?.value ?? '')]),
    ) as Record<FieldName, string>
    setErrors(next)
    const firstInvalid = FIELDS.find((field) => next[field])
    if (firstInvalid || fileError) {
      event.preventDefault()
      if (firstInvalid) control(firstInvalid)?.focus()
      else fileInputRef.current?.focus()
      return
    }
    /* Return to this page (and this section, e.g. /#contact) after FormSubmit has sent the email. */
    const section = formRef.current?.closest('section[id]')?.id
    nextRef.current!.value =
      `${window.location.origin}${window.location.pathname}?${SENT_PARAM}=1` +
      (section ? `#${section}` : '')
    setSent(false)
    setSending(true)
    /* No preventDefault: the browser performs the multipart POST to FormSubmit. */
  }

  return (
    <form
      ref={formRef}
      action={endpoint}
      method="POST"
      encType="multipart/form-data"
      noValidate
      onSubmit={handleSubmit}
      className={cn('flex w-full flex-col gap-5', className)}
    >
      {/* FormSubmit options: return URL, subject, table layout, no captcha page, honeypot. */}
      <input ref={nextRef} type="hidden" name="_next" />
      <input type="hidden" name="_subject" value={contactPage.subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" hidden />

      {[name, email].map((field) => (
        <TextField
          key={field.name}
          size="compact"
          {...field}
          error={errors[field.name]}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ))}
      <div className="flex flex-col gap-5 md:flex-row">
        <TextField
          size="compact"
          {...phone}
          error={errors[phone.name]}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <div className="flex w-full flex-col gap-2">
          <div
            className={cn(
              'bg-light-grey flex h-14 w-full items-center gap-2 rounded-[16px] border px-6 py-4',
              fileError ? 'border-negative' : 'focus-within:border-stroke-light border-transparent',
            )}
          >
            <label
              htmlFor={fileId}
              className={cn(
                'min-w-0 flex-1 cursor-pointer truncate font-sans text-[16px] leading-[1.2] font-light',
                fileName ? 'text-text-dark' : 'text-text-ultra-light',
              )}
            >
              <input
                ref={fileInputRef}
                id={fileId}
                type="file"
                name={attachment.name}
                accept={attachment.accept}
                onChange={handleFileChange}
                aria-invalid={fileError ? true : undefined}
                aria-describedby={fileError ? fileErrorId : undefined}
                className="sr-only"
              />
              {fileName || attachment.label}
              {fileName && <span className="sr-only"> ({attachment.label})</span>}
            </label>
            {fileName && (
              <button
                type="button"
                onClick={clearFile}
                className="tap-target text-text-ultra-light hover:text-text-dark shrink-0 font-sans text-[14px] underline"
              >
                Remove
              </button>
            )}
          </div>
          {fileError && (
            <p id={fileErrorId} className="text-negative px-2 font-sans text-[14px]">
              {fileError}
            </p>
          )}
        </div>
      </div>
      <TextArea
        size="compact"
        {...contactPage.message}
        className={messageHeight}
        error={errors.message}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <FormCta
        size="bar"
        label={sending ? contactPage.sending : contactPage.submit}
        disabled={sending}
        aria-busy={sending || undefined}
      />
      <p role="status" className={cn('text-positive font-sans text-[16px]', !sent && 'sr-only')}>
        {sent ? contactPage.sent : ''}
      </p>
    </form>
  )
}
