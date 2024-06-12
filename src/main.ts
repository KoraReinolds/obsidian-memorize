import { Plugin } from 'obsidian'
import { parse } from 'yaml'

export default class MemoPlugin extends Plugin {
  async onload() {
    console.log('Hi from memo plugin!')

    this.registerMarkdownCodeBlockProcessor('memo', (source, el, ctx) => {
      const settings = parse(source)
      console.log(settings)
    })
  }

  onunload() {}
}
