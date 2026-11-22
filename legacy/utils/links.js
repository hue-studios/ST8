// Links that leave the site open in a new tab; links within it stay in the same one.
//
// Used on the Housing page for the framework buttons and for the CMS rich text. Rich text arrives
// as an HTML string and is rendered with v-html on the server as well as in the browser, so this
// rewrites the string rather than the DOM. If ST8 wants the same everywhere, run the other
// pages' v-html content through openExternalLinksInNewTab too.

const SITE_HOST = /^(www\.)?southerntier8\.org$/i

// True for an absolute http(s) or protocol-relative URL on another host. Relative links, anchors,
// mailto: and tel: are not "off the site".
export function isExternal(href) {
  const match = /^\s*(?:https?:)?\/\/([^/?#:\s]+)/i.exec(href || '')
  return Boolean(match) && !SITE_HOST.test(match[1])
}

export function openExternalLinksInNewTab(html) {
  if (!html) return ''
  return String(html).replace(/<a\b([^>]*)>/gi, (tag, attrs) => {
    const href = /\bhref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs)
    if (!href || !isExternal(href[2] || href[3])) return tag
    // Replace whatever target/rel the editor set, so a link can't end up with two of each.
    const rest = attrs.replace(
      /\s+(?:target|rel)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ''
    )
    return '<a' + rest + ' target="_blank" rel="noopener">'
  })
}
