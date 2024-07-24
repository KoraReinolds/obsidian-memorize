import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getRandomFile
} from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'

export class RandomAssociations extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
  }

  get filteredFiles() {
    return filterFilesByLinks(
      this.files,
      this.plugin.memo?.suggestions?.links
    )
  }

  getItems() {
    return [getRandomFile(this.filteredFiles)].filter(
      (file) => !!file
    )
  }

  render(el: HTMLElement) {
    if (!this.items) return

    const div = el.createDiv()
    div.innerHTML = this.items[0]?.basename
    el.appendChild(div)
  }

  getAll() {
    const folder =
      this.plugin.app.vault.getAbstractFileByPath(
        this.plugin.settings.rootFolder
      )

    const files = getAllFiles(folder)

    const associations = filterFilesByTag(
      this.plugin.app,
      files,
      this.plugin.settings.association.tag
    )

    return associations
  }
}
