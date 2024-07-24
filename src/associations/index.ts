import { AList } from '@/list'
import { type TMode } from '@/settings/types'
import { RandomAssociations } from './random'

export const associationMapper: Record<
  TMode,
  new (...args: any[]) => AList
> = {
  random: RandomAssociations,
  card: RandomAssociations
}
