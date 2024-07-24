import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getFilesLinks,
  getRandomFile
} from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'

export class RandomSuggestions extends AList {
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

  getItems() {
    const associations =
      this.plugin.memo?.associations?.items || null

    if (!associations || !associations[0]) return []

    const associationLinks = getFilesLinks(
      this.plugin.app,
      associations
    )

    const suggestions = filterFilesByLinks(
      this.files,
      associationLinks
    )

    return suggestions
  }

  render(el: HTMLElement) {
    const div = el.createDiv()
    const input = div.createEl('input')
    input.type = 'text'
    input.name = 'association'
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
