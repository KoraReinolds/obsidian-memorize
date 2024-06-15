import type { TFile } from 'obsidian'
import type { IList } from './types'
import type MemoPlugin from '@/main'
import { getFilesLinks } from '@/files'

export abstract class AList implements IList {
  files: TFile[]
  plugin: MemoPlugin
  item: TFile | null
  abstract filteredFiles: TFile[]

  constructor(plugin: MemoPlugin) {
    this.plugin = plugin
    this.files = this.getAll()
    this.item = this.getItem()
  }

  get links() {
    return getFilesLinks(this.plugin.app, this.files)
  }

  abstract getItem(): TFile

  abstract render(): void

  abstract getAll(): TFile[]
}
