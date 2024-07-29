import type {
  IMemoApp,
  TCheckFunc,
  TCheckItem,
  TResultFunc
} from './types'
import type { IObsidianList, TItem } from '@/list/types'

export class MemoApp implements IMemoApp<IObsidianList> {
  associations: IObsidianList | null = null
  suggestions: IObsidianList | null = null
  status: 'ok' | 'error' | 'empty' = 'empty'
  check: TCheckFunc
  result: TResultFunc

  constructor(params: {
    check: TCheckFunc
    result: TResultFunc
  }) {
    this.check = params.check
    this.result = params.result
  }

  init(params: {
    association: IObsidianList
    suggestion: IObsidianList
  }): void {
    this.associations = params.association
    this.suggestions = params.suggestion
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

    const correct = this.suggestions?.items || []

    const checkBtn = form.createEl('button')
    checkBtn.innerHTML = 'Check'
    checkBtn.type = 'submit'
    form.onsubmit = (e) => {
      e.preventDefault()
      const formData = new FormData(form)
      const { association } = Object.fromEntries(
        formData.entries()
      )
      const input = { value: `${association}` }
      this.check({
        input,
        correct
      })
      this.result({ el: status, correct, input })
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
