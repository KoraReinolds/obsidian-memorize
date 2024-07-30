import type {
  IMemoApp,
  TCheckFunc,
  TCheckItem,
  TResultFunc,
  TSubmitFunc
} from './types'
import type { IObsidianList, TItem } from '@/list/types'

export class MemoApp implements IMemoApp<IObsidianList> {
  associations: IObsidianList | null = null
  suggestions: IObsidianList | null = null
  status: 'ok' | 'error' | 'empty' = 'empty'
  submit: TSubmitFunc

  constructor(params: { submit: TSubmitFunc }) {
    this.submit = params.submit
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
      this.submit({ formData, status, correct })
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
