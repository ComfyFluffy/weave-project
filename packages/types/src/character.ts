import z from 'zod'

/**
 * Character represents a person or creature in the game world
 */
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "角色名称不能为空").max(50, "角色名称不能超过50个字符"),
  description: z.string().max(500, "角色描述不能超过500个字符").optional(),
  avatar: z.string().optional(),
})

export type Character = z.infer<typeof CharacterSchema>
