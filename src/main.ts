import { Plugin } from 'obsidian'
import { parse, stringify } from 'yaml'
import { isCodeBlockSettings } from './settings/types'

export default class MemoPlugin extends Plugin {
  async onload() {
    console.log('Hi from memo plugin!')

    this.registerMarkdownCodeBlockProcessor('memo', (source, el, ctx) => {
      console.log(stringify({ number: 3, plain: { block: 'two\nlines\n' } }))
      try {
        const settings = parse(source)
        if (isCodeBlockSettings(settings)) {
          el.innerHTML = JSON.stringify(settings)
        } else {
          throw new Error('Not valid settings')
        }
      } catch {
        el.innerHTML = 'Parsing error'
      }
    })
  }

  onunload() {}
}
