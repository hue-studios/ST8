import { z } from 'zod'

// The resource request form, validated the same way in the browser (vee-validate takes this schema directly) and in the
// server route that forwards the post to the CMS.
export const RESEARCH_OPTIONS = ['Print', 'TV', 'Online', 'Social Media', 'Referral', 'Other'] as const

export const resourceRequestFormSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200),
  email: z.string().trim().max(320).pipe(z.email('Please enter a valid email address.')),
  company: z.string().trim().max(200).optional(),
  research: z.enum(RESEARCH_OPTIONS, 'Please tell us how you heard about us.'),
})

export const resourceRequestSchema = resourceRequestFormSchema.extend({
  resource: z.number().int().positive(),
})
