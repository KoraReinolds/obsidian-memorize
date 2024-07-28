import type {
  IMemoApp,
  TObsidianAppParams
} from '@/app/types'
import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getFilesLinks
} from '@/files'
import { AObsidianList } from '@/list'
import type { IObsidianList } from '@/list/types'

export class RandomSuggestions extends AObsidianList {
  _memo: IMemoApp<IObsidianList>

  constructor(params: TObsidianAppParams) {
    super(params)
    this._files = this.getAll()
    this._memo = params.memo
  }

  get filteredItems() {
    return filterFilesByLinks(
      this._files,
      this._memo?.associations?.getLinks()
    ).map(this.mapper)
  }

  getItems() {
    const associations =
      this._memo?.associations?.items || null

    if (!associations || !associations[0]) return []

    const associationLinks = getFilesLinks(
      this._app,
      (this._memo?.associations?._files || []).filter(
        (file) =>
          associations.some(
            (item) => item.value === file.basename
          )
      )
    )

    const suggestions = filterFilesByLinks(
      this._files,
      associationLinks
    )

    return suggestions.map(this.mapper)
  }

  render(el: HTMLElement) {
    const div = el.createDiv()
    const input = div.createEl('input')
    input.type = 'text'
    input.name = 'association'
    input.placeholder = 'Type association'
  }

  getAll() {
    const folder = this._app.vault.getAbstractFileByPath(
      this._settings.rootFolder
    )

    const files = getAllFiles(folder)

    const suggestions = filterFilesByTag(
      this._app,
      files,
      this._settings.suggestion.tag
    )

    return suggestions
  }
}
