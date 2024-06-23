import type { IList } from '@/list/types'
import { Plugin } from 'obsidian'

export interface IMemoApp {
  plugin: Plugin
  associations: IList | null
  suggestions: IList | null

  check(form: HTMLFormElement): void
  render(el: HTMLElement): void
  next(): void
}
