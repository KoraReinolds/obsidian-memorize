import type {
  TItem,
  TObsidianListParams
} from '@/list/types'

export type TSubmitFunc = (params: TSubmitParams) => void

export type TCheckFunc = (params: TCheckParams) => boolean

export type TResultFunc = (params: TCheckResult) => void

export interface IMemoApp<T> {
  associations: T | null
  suggestions: T | null

  submit: TSubmitFunc
  render(el: HTMLElement): void
  next(): void
}

export type TCheckItem = {
  value: string
}

export type TCheckResult = {
  el: HTMLElement
} & TCheckParams

export type TSubmitParams = {
  formData: FormData
  status: HTMLElement
  correct: TItem[]
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
