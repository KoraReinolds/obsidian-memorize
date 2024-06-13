export interface ICodeBlockSettings {
  rootFolder: string
  association: {
    tag: string
  }
  suggestion: {
    tag: string
  }
}

export const isCodeBlockSettings = (obj: any): obj is ICodeBlockSettings => {
  return (
    obj &&
    obj.rootFolder &&
    typeof obj.rootFolder === 'string' &&
    obj.association?.tag &&
    typeof obj.association?.tag === 'string' &&
    obj.suggestion?.tag &&
    typeof obj.suggestion?.tag === 'string'
  )
}
