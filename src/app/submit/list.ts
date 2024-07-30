import type { TSubmitParams } from '../types'

export const listSubmit = ({
  formData,
  correct,
  status
}: TSubmitParams) => {
  status.innerHTML = ''
  const selected = new Set(
    Object.keys(Object.fromEntries(formData.entries()))
  )
  const rightSuggestions = new Set(
    correct.map((item) => item.value)
  )
  const match = selected.intersection(rightSuggestions)
  const dismatch = selected.difference(rightSuggestions)
  const notChecked = rightSuggestions.difference(selected)
  console.log(match, dismatch, rightSuggestions)

  if (match.size)
    status.createDiv().innerHTML = `Correct: <br>${[...match].join('<br>')}`
  if (dismatch.size)
    status.createDiv().innerHTML = `Wrong: <br>${[...dismatch].join('<br>')}`
  if (notChecked.size)
    status.createDiv().innerHTML = `Not checked: <br>${[...notChecked].join('<br>')}`
}
