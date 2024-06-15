import type { TFile } from 'obsidian'
import type { IList } from './types'
import type MemoPlugin from '@/main'
import { getFilesLinks } from '@/files'

export abstract class AList implements IList {
  list: TFile[]
  plugin: MemoPlugin
  item: TFile | null

  constructor(plugin: MemoPlugin) {
    this.plugin = plugin
    this.list = this.getAll()
    this.item = this.getItem()
  }

  get links() {
    return getFilesLinks(this.plugin.app, this.list)
  }

  getItem(): TFile {
    throw new Error('Method not implemented.')
  }

  render(): void {
    throw new Error('Method not implemented.')
  }

  getAll(): TFile[] {
    throw new Error('Method not implemented.')
  }
}
