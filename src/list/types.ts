import type MemoPlugin from '@/main'
import { TFile } from 'obsidian'

export interface IList {
  files: TFile[]
  filteredFiles: TFile[]
  links: Set<string>
  plugin: MemoPlugin
  item: TFile | null
  itemName: string

  render(el: HTMLElement): void
  next(): void
  getAll(): TFile[]
  getItem(): TFile | null
}
