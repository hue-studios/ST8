// Directus 12 returns linked items the visitor may not read (drafts, archived) as null,
// e.g. services.news = [{ id: 21, news_id: { … } }, { id: 22, news_id: null }]. Directus 8 exposed
// drafts publicly, so templates assume every link resolves. Drop those unresolved link rows: array
// entries made only of `id` / `sort` / `*_id` keys where a `*_id` is null.
function isUnresolvedLink(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  const linkKeys = keys.filter((k) => k.endsWith('_id'))
  return (
    linkKeys.length > 0 &&
    keys.every((k) => k === 'id' || k === 'sort' || k.endsWith('_id')) &&
    linkKeys.some((k) => value[k] === null)
  )
}

function prune(value) {
  if (Array.isArray(value)) {
    return value.filter((v) => !isUnresolvedLink(v)).map(prune)
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = prune(value[key])
  }
  return value
}

export default function ({ $axios }) {
  $axios.onResponse((response) => {
    const url = response.config.url || ''
    const isCms = url.startsWith('/') || url.startsWith(process.env.apiUrl)
    if (isCms && response.data) response.data = prune(response.data)
    return response
  })
}
