import { type TMode } from '@/settings/types'
import { RandomAssociations } from './random'
import type { AObsidianList } from '@/list'
import type { TObsidianAppParams } from '@/app/types'
import { ListAssociations } from './list'

export const associationMapper: Record<
  TMode,
  new (args: TObsidianAppParams) => AObsidianList
> = {
  random: RandomAssociations,
  card: RandomAssociations,
  list: ListAssociations
}
