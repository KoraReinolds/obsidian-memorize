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
import { getRandomValueBetween } from '@/lib'
import { AObsidianList } from '@/list'
import type { IObsidianList } from '@/list/types'
import {
  isListSettings,
  type IListSettings
} from '@/settings/types'
import { mock } from 'node:test'

export class ListSuggestions extends AObsidianList {
  _memo: IMemoApp<IObsidianList>
  _listSettings: IListSettings

  constructor(params: TObsidianAppParams) {
    super(params)
    this._files = this.getAll()
    this._memo = params.memo
    if (isListSettings(params.settings)) {
      this._listSettings = params.settings
    } else {
      throw new Error('Wrong list settings type')
    }
  }

  get filteredItems() {
    return filterFilesByLinks(
      this._files,
      this._memo?.associations?.getLinks()
    ).map(this.mapper)
  }

  getItems() {
    const associations = [
      ...(this._memo?.associations?.items || [])
    ]

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

    const min = this._listSettings.suggestion.range.min
    const max = getRandomValueBetween(
      min,
      this._listSettings.suggestion.range.max
    )

    const items = suggestions.slice(0, max).map(this.mapper)

    return items
  }

  render(el: HTMLElement) {
    const ul = el.createEl('ul')

    const itemValues = this.items.map((i) => i.value)
    const mockCount =
      this._listSettings.suggestion.total -
      this.items.length

    const mockItems = (
      this._memo.suggestions?.filteredItems || []
    )
      .filter((item) => !itemValues.includes(item.value))
      .slice(0, mockCount)

    const items = [...this.items, ...mockItems].shuffle()

    items.forEach((item) => {
      const li = ul.createEl('li')

      const checkbox = li.createEl('input')
      const id = `${Math.random()}`
      checkbox.id = id
      checkbox.type = 'checkbox'
      checkbox.name = item.value

      const label = li.createEl('label')
      label.innerHTML = item.value
      label.setAttr('for', id)
    })
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
