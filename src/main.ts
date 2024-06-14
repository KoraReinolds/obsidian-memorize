import { Plugin } from 'obsidian'
import { parse } from 'yaml'
import {
  isCodeBlockSettings,
  type ICodeBlockSettings
} from './settings/types'
import {
  filterFilesByTag,
  getAllFiles,
  getFilesLinks
} from './files'

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

  async onload() {
    console.log('Hi from memo plugin!')

    this.registerMarkdownCodeBlockProcessor(
      'memo',
      (source, el, ctx) => {
        try {
          const settings = parse(source)

          if (isCodeBlockSettings(settings)) {
            this.settings = settings

            const folder =
              this.app.vault.getAbstractFileByPath(
                settings.rootFolder
              )

            const files = getAllFiles(folder)

            const associations = filterFilesByTag(
              this.app,
              files,
              settings.association.tag
            )

            const associationLinks = getFilesLinks(
              this.app,
              associations
            )

            const suggestions = filterFilesByTag(
              this.app,
              files,
              settings.suggestion.tag
            ).filter((file) =>
              associationLinks.has(file.basename)
            )
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
