import type { z } from 'zod'

/**
 * Lets vee-validate use a zod 4 schema. vee-validate 4.15 predates zod 4 and cannot read a zod 4 schema directly (it
 * does not support Standard Schema), and `@vee-validate/zod` targets zod 3, so this is the small adapter in between:
 * vee-validate's typed-schema shape, with zod's issues turned into per-field messages.
 */
export function toZodSchema<T extends z.ZodType>(schema: T) {
  return {
    __type: 'VVTypedSchema' as const,
    async parse(values: unknown) {
      const result = await schema.safeParseAsync(values)
      if (result.success) return { value: result.data as z.output<T>, errors: [] }

      const byPath = new Map<string, { path: string, errors: string[] }>()
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        const entry = byPath.get(path) ?? { path, errors: [] }
        entry.errors.push(issue.message)
        byPath.set(path, entry)
      }
      return { errors: [...byPath.values()] }
    },
  }
}
