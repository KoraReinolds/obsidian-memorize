import { type TMode } from '@/settings/types'
import type { TSubmitFunc } from '@/app/types'
import { randomSubmit } from './random'
import { listSubmit } from './list'

export const submitMapper: Record<TMode, TSubmitFunc> = {
  random: randomSubmit,
  card: randomSubmit,
  list: listSubmit
}
