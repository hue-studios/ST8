// The resource request form posts here, and this route forwards it to the CMS's `requests` collection. The CMS only
// accepts browser requests from the live site's origin, so the form cannot post to it directly from the preview or
// from localhost; a Directus Flow on requests.create sends the confirmation email. The post carries no token: the
// public role may create requests, nothing else.
import { resourceRequestSchema } from '../../shared/utils/resource-request'

export default defineEventHandler(async (event) => {
  const parsed = resourceRequestSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Please check the form and try again.' })
  }
  const { name, email, company, research, resource } = parsed.data

  const res = await fetch(`${useRuntimeConfig().public.directusUrl}/items/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, company: company || null, research, resource, status: 'published' }),
  }).catch(() => null)

  if (!res || !res.ok) {
    console.error('resource request: the CMS refused the post', res?.status, res ? await res.text().catch(() => '') : 'no response')
    throw createError({ statusCode: 502, statusMessage: 'We could not save your request. Please try again.' })
  }
  return { ok: true }
})
