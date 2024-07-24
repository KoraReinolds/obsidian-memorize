export type TMode = 'card' | 'random'

export interface ICodeBlockSettings {
  rootFolder: string
  mode?: TMode
  association: {
    tag: string
  }
  suggestion: {
    tag: string
  }
}

const isMode = (value: any): value is TMode => {
  return value === 'card' || value === 'random'
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

  if (data.mode && !isMode(data.mode))
    throw new Error('Unsupported mode: ' + data.mode)

  return true
}
