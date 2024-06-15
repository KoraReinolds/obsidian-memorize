import { filterFilesByTag, getAllFiles } from '@/files'
import { AList } from '@/list'
import type MemoPlugin from '@/main'
import type { TFile } from 'obsidian'

export class Suggestions extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
    this.list = this.getAll()
  }

  getItem(): TFile {
    throw new Error('Method not implemented.')
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
    ).filter((file) =>
      this.plugin.memo?.associations?.links.has(
        file.basename
      )
    )

    return suggestions
  }
}
