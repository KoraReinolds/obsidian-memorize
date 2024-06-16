import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getFilesLinks,
  getMetadata,
  getRandomFile
} from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'

export class Suggestions extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
    this.files = this.getAll()
  }

  get filteredFiles() {
    return filterFilesByLinks(
      this.files,
      this.plugin.memo?.associations?.links
    )
  }

  getItem() {
    const association =
      this.plugin.memo?.associations?.item || null

    if (!association) return null
    const associationLinks = getFilesLinks(
      this.plugin.app,
      [association]
    )

    const suggestions = filterFilesByLinks(
      this.files,
      associationLinks
    )

    return getRandomFile(suggestions)
  }

  render(el: HTMLElement) {
    const div = el.createDiv()
    const input = div.createEl('input')
    input.placeholder = 'Type association'
  }

  getAll() {
    const folder =
      this.plugin.app.vault.getAbstractFileByPath(
        this.plugin.settings.rootFolder
      )

    const files = getAllFiles(folder)

    const suggestions = filterFilesByTag(
      this.plugin.app,
      files,
      this.plugin.settings.suggestion.tag
    )

    return suggestions
  }
}
