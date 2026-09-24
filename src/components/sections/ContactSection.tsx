import type { FormEvent } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FormCta } from '@/components/ui/FormCta'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { TextArea, TextField } from '@/components/ui/TextField'
import { contact } from '@/data/home'

/**
 * "Get in touch" contact form — Home, and reused by the Contact page.
 * The submission endpoint is not defined yet (see README open questions), so submit is a no-op.
 */
export function ContactSection() {
  const { fields } = contact

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <Panel
      as="section"
      id="contact"
      aria-labelledby="contact-heading"
      className="p-section-inner flex flex-col gap-12"
    >
      <Eyebrow>{contact.eyebrow}</Eyebrow>
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <h2
          id="contact-heading"
          className="font-display text-h2 text-text-dark font-light lg:w-[440px] lg:-translate-y-[25px]"
        >
          <RichHeading lines={[contact.headline]} accentWeight="light-italic" />
        </h2>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 lg:w-[544px] lg:pb-4">
          <TextField size="compact" label={fields.name} name="name" autoComplete="name" />
          <TextField
            size="compact"
            label={fields.company}
            name="company"
            autoComplete="organization"
          />
          <div className="flex flex-col gap-5 md:flex-row">
            <TextField
              size="compact"
              label={fields.phone}
              name="phone"
              type="tel"
              autoComplete="tel"
            />
            <TextField
              size="compact"
              label={fields.email}
              name="email"
              type="email"
              autoComplete="email"
            />
          </div>
          <TextArea size="compact" label={fields.message} name="message" className="h-[168px]" />
          <FormCta size="bar" label={contact.submit} />
        </form>
      </div>
    </Panel>
  )
}
