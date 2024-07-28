import type {
  IMemoApp,
  TObsidianAppParams
} from '@/app/types'
import {
  filterFilesByLinks,
  filterFilesByTag,
  getAllFiles,
  getRandomItem
} from '@/files'
import { AObsidianList } from '@/list'
import type { IObsidianList } from '@/list/types'

export class RandomAssociations extends AObsidianList {
  _memo: IMemoApp<IObsidianList>

  constructor(params: TObsidianAppParams) {
    super(params)
    this._memo = params.memo
  }

  get filteredItems() {
    return filterFilesByLinks(
      this._files,
      this._memo?.suggestions?.getLinks()
    ).map(this.mapper)
  }

  getItems() {
    return [getRandomItem(this.filteredItems)].filter(
      (file) => !!file
    )
  }

  render(el: HTMLElement) {
    if (!this.items) return

    const div = el.createDiv()
    div.innerHTML = this.items[0]?.value
    el.appendChild(div)
  }

  getAll() {
    const folder = this._app.vault.getAbstractFileByPath(
      this._settings.rootFolder
    )

    const files = getAllFiles(folder)

    const associations = filterFilesByTag(
      this._app,
      files,
      this._settings.association.tag
    )

    return associations
  }
}
