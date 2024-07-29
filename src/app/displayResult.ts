import type { TCheckResult } from './types'

export const randomResult = (
  params: TCheckResult
): void => {
  params.el.innerHTML = params.correct
    .map((item) => item.value)
    .join('<br>')
}
