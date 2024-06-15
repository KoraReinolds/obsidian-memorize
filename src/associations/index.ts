import { filterFilesByTag, getAllFiles } from '@/files'
import { getRandomValueBetween } from '@/lib'
import { AList } from '@/list'
import type MemoPlugin from '@/main'
import type { TFile } from 'obsidian'

export class Associations extends AList {
  constructor(plugin: MemoPlugin) {
    super(plugin)
  }

  getItem(): TFile {
    return this.list[
      getRandomValueBetween(0, this.list.length - 1)
    ]
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

    const associations = filterFilesByTag(
      this.plugin.app,
      files,
      this.plugin.settings.association.tag
    )

    return associations
  }
}
