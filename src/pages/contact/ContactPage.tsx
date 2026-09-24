import { Seo } from '@/components/layout/Seo'
import { ContactForm } from '@/components/sections/ContactForm'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { RichHeading } from '@/components/ui/RichHeading'
import { contactPage } from '@/data/contactPage'
import { contact } from '@/data/home'
import { pageMeta } from '@/data/seo'

/* Contact us — layout and fields from the Webflow page (heading beside the form). */
export function ContactPage() {
  return (
    <>
      <Seo {...pageMeta.contact} />
      <section aria-labelledby="contact-page-heading" className="flex flex-col gap-8 lg:gap-10">
        <Eyebrow>{contactPage.eyebrow}</Eyebrow>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <h1
            id="contact-page-heading"
            className="font-display text-h2 text-text-dark font-light lg:w-[440px]"
          >
            <RichHeading lines={[contact.headline]} accentWeight="light-italic" />
          </h1>
          <ContactForm className="lg:w-[600px]" messageHeight="h-[240px]" />
        </div>
      </section>
    </>
  )
}
