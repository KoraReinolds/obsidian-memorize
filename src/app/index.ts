import type { IMemoApp, TCheckFunc } from './types'
import type { IList } from '@/list/types'
import type { AList } from '@/list'

export class MemoApp implements IMemoApp {
  associations: IList | null = null
  suggestions: IList | null = null
  status: 'ok' | 'error' | 'empty' = 'empty'
  check: TCheckFunc

  constructor(check: TCheckFunc) {
    this.check = check
  }

  init(params: {
    association: AList
    suggestion: AList
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

    const checkBtn = form.createEl('button')
    checkBtn.innerHTML = 'Check'
    checkBtn.type = 'submit'
    form.onsubmit = (e) => {
      e.preventDefault()
      const formData = new FormData(form)
      const { association } = Object.fromEntries(
        formData.entries()
      )
      console.log(
        this.check({
          input: { value: `${association}` },
          correct: (this.suggestions?.items || []).map(
            (file) => ({
              value: file.basename
            })
          )
        })
      )
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
