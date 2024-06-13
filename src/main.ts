import { Plugin } from 'obsidian'
import { parse } from 'yaml'
import { isCodeBlockSettings } from './settings/types'
import { getAllFiles } from './files'

export default class MemoPlugin extends Plugin {
  async onload() {
    console.log('Hi from memo plugin!')

    this.registerMarkdownCodeBlockProcessor('memo', (source, el, ctx) => {
      try {
        const settings = parse(source)
        if (isCodeBlockSettings(settings)) {
          const folder = this.app.vault.getAbstractFileByPath(settings.rootFolder)
          const files = getAllFiles(folder)
          el.innerHTML = `files: ${files.length}`
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
