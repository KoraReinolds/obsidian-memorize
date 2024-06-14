import { Plugin } from 'obsidian'
import { parse } from 'yaml'
import {
  isCodeBlockSettings,
  type ICodeBlockSettings
} from './settings/types'
import { MemoApp } from './app'

export default class MemoPlugin extends Plugin {
  settings: ICodeBlockSettings = {
    rootFolder: '',
    association: {
      tag: ''
    },
    suggestion: {
      tag: ''
    }
  }
  memo: MemoApp | null = null

  async onload() {
    console.log('Hi from memo plugin!')

    this.registerMarkdownCodeBlockProcessor(
      'memo',
      (source, el, ctx) => {
        try {
          const settings = parse(source)

          if (isCodeBlockSettings(settings)) {
            this.settings = settings
            this.memo = new MemoApp(this)
            this.memo.init()
          } else {
            throw new Error('Not valid settings')
          }
        } catch {
          el.innerHTML = 'Parsing error'
        }
      }
    )
  }

  onunload() {}
}
