import type { TFile } from 'obsidian'
import type { IList } from './types'
import type MemoPlugin from '@/main'
import { getFilesLinks } from '@/files'

export abstract class AList implements IList {
  files: TFile[]
  plugin: MemoPlugin
  items: TFile[] = []
  abstract filteredFiles: TFile[]

  constructor(plugin: MemoPlugin) {
    this.plugin = plugin
    this.files = this.getAll()
  }

  next(): void {
    this.items = this.getItems()
  }

  get links() {
    return getFilesLinks(this.plugin.app, this.files)
  }

  abstract getItems(): TFile[]

  abstract render(el: HTMLElement): void

  abstract getAll(): TFile[]
}
