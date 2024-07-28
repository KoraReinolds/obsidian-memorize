import { Plugin } from 'obsidian'
import { parse } from 'yaml'
import { associationMapper } from '@/associations'
import { suggestionMapper } from '@/suggestions'
import {
  isCodeBlockSettings,
  type ICodeBlockSettings
} from './settings/types'
import { MemoApp } from './app'
import { randomCheck } from './app/checkResult'

export default class MemoPlugin extends Plugin {
  settings: ICodeBlockSettings = {
    rootFolder: '',
    mode: 'random',
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
            this.memo = new MemoApp(randomCheck)
            const params = {
              settings: this.settings,
              app: this.app,
              memo: this.memo
            }
            this.memo.init({
              association: new associationMapper[
                this.settings.mode
              ](params),
              suggestion: new suggestionMapper[
                this.settings.mode
              ](params)
            })
            this.memo.next()
            this.memo.render(el)
            console.log(this.memo)
          } else {
            throw new Error('Not valid settings')
          }
        } catch (e) {
          el.innerHTML = 'Parsing error: \n' + e
        }
      }
    )
  }

  onunload() {}
}
