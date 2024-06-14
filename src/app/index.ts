import type MemoPlugin from '@/main'
import { Associations } from '@/associations'
import { Suggestions } from '@/suggestions'
import type { IMemoApp } from './types'
import type { IList } from '@/list/types'

export class MemoApp implements IMemoApp {
  plugin: MemoPlugin
  associations: IList | null = null
  suggestions: IList | null = null

  constructor(plugin: MemoPlugin) {
    this.plugin = plugin
  }

  init(): void {
    this.associations = new Associations(this.plugin)
    this.suggestions = new Suggestions(this.plugin)
  }

  check(): void {
    throw new Error('Method not implemented.')
  }

  next(): void {
    throw new Error('Method not implemented.')
  }
}
