export type TMode = 'card' | 'random' | 'list'

export interface ICodeBlockSettings {
  rootFolder: string
  mode: TMode
  association: {
    tag: string
  }
  suggestion: {
    tag: string
  }
}

export interface IListSettings {
  rootFolder: string
  mode: TMode
  association: {
    tag: string
  }
  suggestion: {
    tag: string
    range: {
      max: number
      min: number
    }
    total: number
  }
}

const isMode = (value: any): value is TMode => {
  return ['card', 'random', 'list'].includes(value)
}

export const isListSettings = (
  data: any
): data is IListSettings => {
  return (
    data.suggestion.range &&
    data.suggestion.range.min &&
    typeof data.suggestion.range.min === 'number' &&
    data.suggestion.range.max &&
    typeof data.suggestion.range.max === 'number' &&
    data.suggestion.total &&
    typeof data.suggestion.total === 'number'
  )
}

export const isCodeBlockSettings = (
  data: any
): data is ICodeBlockSettings => {
  if (typeof data !== 'object')
    throw new Error('Wrong format')

  if (!data.association?.tag)
    throw new Error('Association tag is required')

  if (!data.suggestion?.tag)
    throw new Error('Suggestion tag is required')

  if (!data.rootFolder)
    throw new Error('RootFolder is required')

  if (!data.mode || !isMode(data.mode))
    throw new Error('Unsupported mode: ' + data.mode)
  else {
    if (!isListSettings(data))
      throw new Error('Total and range are required')
  }

  return true
}
