import { z } from '@/lib/zod'

/** Options of the Subject dropdown; the original loads its list from the CMS. */
export const INQUIRY_SUBJECTS = [
  'Digital transformation strategy',
  'Web or mobile application',
  'Digital commerce',
  'Brand and creative',
  'Marketing campaign',
  'Partnership',
  'Careers',
  'Other',
] as const

export const inquirySchema = z.object({
  subject: z.enum(INQUIRY_SUBJECTS, { message: 'Choose a subject.' }),
  name: z
    .string()
    .trim()
    .min(2, 'Enter your name (at least 2 characters).')
    .max(80, 'Your name must be 80 characters or fewer.'),
  company: z
    .string()
    .trim()
    .min(2, 'Enter your company or institution.')
    .max(120, 'The company name must be 120 characters or fewer.'),
  email: z.email('Enter a valid work email, like name@company.com.'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, 'Enter a phone number with 7 to 20 digits.'),
  country: z
    .string()
    .trim()
    .min(2, 'Enter your country.')
    .max(60, 'The country must be 60 characters or fewer.'),
  // 500 matches the STRING column size Backendless creates for `message`.
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a bit more (at least 20 characters).')
    .max(500, 'The message must be 500 characters or fewer.'),
  /** Honeypot: hidden from people, filled by bots. Never shown as an error. */
  website: z.string().optional(),
})

export type InquiryFormValues = z.infer<typeof inquirySchema>

export const EMPTY_INQUIRY_VALUES: InquiryFormValues = {
  subject: 'Digital transformation strategy',
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  message: '',
  website: '',
}
