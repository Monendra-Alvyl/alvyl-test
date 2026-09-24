/*
 * Contact us page — content copied from https://alvyl-revamp-site.webflow.io/contact-us.
 * The heading is shared with the "Get in touch" section (data/home.ts → contact.headline).
 */
export const contactPage = {
  eyebrow: 'Get in touch',
  fields: [
    { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
    { name: 'contact', label: 'Contact No', type: 'tel', autoComplete: 'tel', required: true },
    {
      name: 'attachment',
      label: 'Attachment Link',
      type: 'url',
      autoComplete: 'off',
      required: false,
    },
  ],
  message: { name: 'message', label: 'Message', required: true },
  submit: 'Submit',
} as const
