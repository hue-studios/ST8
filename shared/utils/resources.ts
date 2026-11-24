// The resource fields the templates read, so no request asks for the whole record ('*'). The cards need:
//   NowResourceCardVertical: id, title, type, link, file.id
//   NowResourceCardData:     the same plus description, require_info (a gated file shows no link) and the first program's title
// require_info stays on every resource read that had it, so a card can always tell a gated file from an open one.
const BASE = ['id', 'title', 'type', 'link', 'require_info', 'file.id']
const CARD = [...BASE, 'description', 'programs.programs_id.title']

const prefixed = (prefix: string, fields: string[]) => fields.map(f => `${prefix}.${f}`)

/** Fields for a resource reached through a link, e.g. resourceFields('related_resources.resources_id'). */
export const resourceFields = (prefix: string) => prefixed(prefix, BASE)
/** Same, with the description and program the full resource card shows. */
export const resourceCardFields = (prefix: string) => prefixed(prefix, CARD)
/** For a read of the resources collection itself. */
export const RESOURCE_BASE_FIELDS = BASE
export const RESOURCE_CARD_FIELDS = CARD
