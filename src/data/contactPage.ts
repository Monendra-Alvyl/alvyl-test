/*
 * Contact us page — content copied from https://alvyl-revamp-site.webflow.io/contact-us.
 * The heading is shared with the "Get in touch" section (data/home.ts → contact.headline).
 */
export const contactPage = {
  eyebrow: 'Get in touch',
  /* Submissions are emailed here by FormSubmit (see components/sections/ContactForm.tsx). */
  recipient: 'hello@alvyl.com',
  /*
   * FormSubmit's random form ID for the recipient, from the activation email ("…use this random
   * string instead of your email"). Set it once the form is activated: the form then posts to
   * formsubmit.co/<formId>, which keeps the email address out of the page's HTML (spam bots).
   */
  formId: '',
  subject: 'New enquiry from the Alvyl website',
  fields: [
    { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
    { name: 'contact', label: 'Contact No', type: 'tel', autoComplete: 'tel', required: true },
  ],
  attachment: {
    name: 'attachment',
    label: 'Attach document',
    accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt',
    /* FormSubmit rejects submissions whose files add up to more than 10 MB. */
    maxBytes: 10 * 1024 * 1024,
    tooLarge: 'The document must be 10 MB or smaller.',
  },
  message: { name: 'message', label: 'Message', required: true },
  /* Shown under each field when it is left empty or filled in wrongly. */
  errors: {
    name: 'Please enter your name.',
    email: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address, like name@company.com.',
    contact: 'Please enter your phone number.',
    contactInvalid: 'Please enter a valid phone number, like +91 98278 28912.',
    message: 'Please enter a message.',
    messageShort: 'Please tell us a little more (at least 10 characters).',
  },
  submit: 'Submit',
  sending: 'Sending…',
  sent: 'Thanks! Your message has been sent. We’ll get back to you soon.',
} as const
