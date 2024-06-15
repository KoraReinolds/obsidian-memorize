import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getFilesLinks,
  getRandomFile
} from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'
import type { TFile } from 'obsidian'

export class Suggestions extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
    this.files = this.getAll()
  }

  get filteredFiles(): TFile[] {
    return filterFilesByLinks(
      this.files,
      this.plugin.memo?.associations?.links
    )
  }

  getItem(): TFile | null {
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

  render(): void {
    throw new Error('Method not implemented.')
  }

  getAll(): TFile[] {
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
