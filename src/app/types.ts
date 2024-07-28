import type { IList } from '@/list/types'

export type TCheckFunc = (params: TCheckParams) => boolean

export interface IMemoApp {
  associations: IList | null
  suggestions: IList | null

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
