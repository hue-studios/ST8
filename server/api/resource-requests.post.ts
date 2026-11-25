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

  const res = await fetchWithTimeout(`${useRuntimeConfig().public.directusUrl}/items/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, company: company || null, research, resource, status: 'published' }),
  }).catch(() => null)

  if (!res || !res.ok) {
    console.error('resource request: the CMS refused the post', res?.status, res ? await res.text().catch(() => '') : 'no response')
    throw createError({ statusCode: 502, statusMessage: 'We could not save your request. Please try again.' })
  }
  // The address is sent only now, once the request is saved, and only for a gated file (see cms/[...path].get.ts).
  return { ok: true, link: await gatedFileLink(parsed.data.resource) }
})

async function gatedFileLink(id: number): Promise<string | null> {
  const res = await cmsRead(`/items/resources/${id}?fields=require_info,file.id`).catch(() => null)
  if (!res || res.status !== 200) return null
  const row = JSON.parse(res.body).data
  if (!row?.require_info || !row.file?.id) return null
  return `${useRuntimeConfig().public.directusUrl}/assets/${row.file.id}`
}
