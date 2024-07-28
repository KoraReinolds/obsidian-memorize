import type { TObsidianListParams } from '@/list/types'

export type TCheckFunc = (params: TCheckParams) => boolean

export interface IMemoApp<T> {
  associations: T | null
  suggestions: T | null

  check: TCheckFunc
  render(el: HTMLElement): void
  next(): void
}

export type TCheckItem = {
  value: string
}

export type TCheckParams = {
  input: TCheckItem
  correct: TCheckItem[]
}

export interface ICheckResult<T> {
  status: 'ok' | 'error' | 'empty'
  details: T
}

export type TObsidianAppParams = TObsidianListParams & {
  memo: IMemoApp<any>
}
