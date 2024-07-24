import type MemoPlugin from '@/main'
import type { IMemoApp } from './types'
import type { IList } from '@/list/types'
import type { AList } from '@/list'

export class MemoApp implements IMemoApp {
  plugin: MemoPlugin
  associations: IList | null = null
  suggestions: IList | null = null
  status: 'ok' | 'error' | 'empty' = 'empty'

  constructor(plugin: MemoPlugin) {
    this.plugin = plugin
  }

  init(params: {
    association: AList
    suggestion: AList
  }): void {
    this.associations = params.association
    this.suggestions = params.suggestion
  }

  check(form: HTMLFormElement): void {
    const formData = new FormData(form)
    const { association } = Object.fromEntries(
      formData.entries()
    )

    this.status =
      association.toString().toLowerCase() ===
      this.suggestions?.itemName.toLowerCase()
        ? 'ok'
        : 'error'

    const status = form.querySelector('#status')

    if (!status) return

    if (this.status === 'ok') {
      status.innerHTML = 'ok'
    } else if (this.status === 'error') {
      status.innerHTML = 'error'
    }
  }

  next(): void {
    this.associations?.next()
    this.suggestions?.next()
  }

  render(el: HTMLElement): void {
    el.innerHTML = ''
    this.associations?.render(el)
    const form = el.createEl('form')
    this.suggestions?.render(form)

    const checkBtn = form.createEl('button')
    checkBtn.innerHTML = 'Check'
    checkBtn.type = 'submit'
    form.onsubmit = (e) => {
      e.preventDefault()
      this.check(form)
    }

    const nextBtn = form.createEl('button')
    nextBtn.innerHTML = 'Next'
    nextBtn.onclick = (e) => {
      e.preventDefault()
      this.next()
      this.render(el)
    }

    const status = form.createDiv()
    status.id = 'status'
  }
}
