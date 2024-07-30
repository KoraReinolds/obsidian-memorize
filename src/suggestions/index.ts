import type { TMode } from '@/settings/types'
import { RandomSuggestions } from './random'
import type { AObsidianList } from '@/list'
import type { TObsidianAppParams } from '@/app/types'
import { ListSuggestions } from './list'

export const suggestionMapper: Record<
  TMode,
  new (args: TObsidianAppParams) => AObsidianList
> = {
  random: RandomSuggestions,
  card: RandomSuggestions,
  list: ListSuggestions
}
