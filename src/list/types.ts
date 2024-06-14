import type MemoPlugin from '@/main'
import { TFile } from 'obsidian'

export interface IList {
  list: TFile[]
  links: Set<string>
  plugin: MemoPlugin

  render(): void
  getAll(): TFile[]
}
