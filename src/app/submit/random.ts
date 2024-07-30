import { randomCheck } from '../checkResult'
import { randomResult } from '../displayResult'
import type { TSubmitParams } from '../types'

export const randomSubmit = ({
  formData,
  correct,
  status
}: TSubmitParams) => {
  const { association } = Object.fromEntries(
    formData.entries()
  )
  const input = { value: `${association}` }
  randomCheck({
    input,
    correct
  })
  randomResult({ el: status, correct, input })
}
