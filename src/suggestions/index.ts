import { AList } from '@/list'
import type { TMode } from '@/settings/types'
import { RandomSuggestions } from './random'

export const suggestionMapper: Record<
  TMode,
  new (...args: any[]) => AList
> = {
  random: RandomSuggestions,
  card: RandomSuggestions
}
