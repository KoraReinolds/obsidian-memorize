import type { TCheckParams } from './types'

export const randomCheck = (
  params: TCheckParams
): boolean => {
  return params.correct
    .map((item) => item.value)
    .includes(params.input.value)
}
