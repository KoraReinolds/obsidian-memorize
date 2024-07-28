import type { TLinks } from '@/files/types'
import type { ICodeBlockSettings } from '@/settings/types'
import { App, TFile } from 'obsidian'

export interface TItem {
  value: string
}

export interface IList<T> {
  filteredItems: TItem[]
  items: TItem[]
  _settings: ICodeBlockSettings

  mapper(args: T): TItem
  getLinks(): TLinks
  render(el: HTMLElement): void
  next(): void
  getAll(): T[]
  getItems(): TItem[]
}

export interface IObsidianList extends IList<TFile> {
  _files: TFile[]
  _app: App
}

export type TObsidianListParams = {
  settings: ICodeBlockSettings
  app: App
}
