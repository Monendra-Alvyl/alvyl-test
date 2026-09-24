import type { FormEvent } from 'react'
import { FormCta } from '@/components/ui/FormCta'
import { TextArea, TextField } from '@/components/ui/TextField'
import { contactPage } from '@/data/contactPage'
import { cn } from '@/lib/cn'

/*
 * Contact form with the Webflow site's fields (Name, Email, Contact No, Attachment Link, Message),
 * used by the "Get in touch" section and the Contact us page. The submission endpoint is not
 * defined yet (see README), so submit only runs the browser's required-field validation.
 */
export function ContactForm({
  className,
  messageHeight,
}: {
  className?: string
  messageHeight: string
}) {
  const [name, email, phone, attachment] = contactPage.fields

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex w-full flex-col gap-5', className)}>
      {[name, email].map((field) => (
        <TextField key={field.name} size="compact" {...field} />
      ))}
      <div className="flex flex-col gap-5 md:flex-row">
        {[phone, attachment].map((field) => (
          <TextField key={field.name} size="compact" {...field} />
        ))}
      </div>
      <TextArea size="compact" {...contactPage.message} className={messageHeight} />
      <FormCta size="bar" label={contactPage.submit} />
    </form>
  )
}
