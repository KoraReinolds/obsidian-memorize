import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getRandomFile
} from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'

export class Associations extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
  }

  get filteredFiles() {
    return filterFilesByLinks(
      this.files,
      this.plugin.memo?.suggestions?.links
    )
  }

  getItem() {
    return getRandomFile(this.filteredFiles)
  }

  render(el: HTMLElement) {
    if (!this.item) return

    const div = el.createDiv()
    div.innerHTML = this.itemName
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
