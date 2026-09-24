import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Panel } from '@/components/ui/Panel'
import { RichHeading } from '@/components/ui/RichHeading'
import { contact } from '@/data/home'
import { ContactForm } from './ContactForm'

/**
 * "Get in touch" section (Home, About, Offerings). On phones it shows only the heading and a
 * "Contact Us" button that opens the full form on /contact-us.
 */
export function ContactSection() {
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
          className="font-display text-h2 text-text-dark font-light lg:w-[440px]"
        >
          <RichHeading lines={[contact.headline]} accentWeight="light-italic" />
        </h2>

        <Button href={contact.mobileCta.href} className="self-start md:hidden">
          {contact.mobileCta.label}
        </Button>

        <ContactForm className="max-md:hidden lg:w-[544px]" messageHeight="h-[168px]" />
      </div>
    </Panel>
  )
}
