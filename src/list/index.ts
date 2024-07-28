import type { App, TFile } from 'obsidian'
import type {
  IObsidianList,
  TItem,
  TObsidianListParams
} from './types'
import { getFilesLinks } from '@/files'
import type { TLinks } from '@/files/types'
import type { ICodeBlockSettings } from '@/settings/types'

export abstract class AObsidianList
  implements IObsidianList
{
  _files: TFile[]
  _app: App
  _settings: ICodeBlockSettings
  items: TItem[] = []
  abstract filteredItems: TItem[]

  constructor(params: TObsidianListParams) {
    this._app = params.app
    this._settings = params.settings
    this._files = this.getAll()
  }

  mapper(args: TFile): TItem {
    return { value: args.basename }
  }

  next(): void {
    this.items = this.getItems()
  }

  getLinks(): TLinks {
    return getFilesLinks(this._app, this._files)
  }

  abstract getItems(): TItem[]

  abstract render(el: HTMLElement): void

  abstract getAll(): TFile[]
}
