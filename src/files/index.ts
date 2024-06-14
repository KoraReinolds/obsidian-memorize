import {
  App,
  TAbstractFile,
  TFile,
  TFolder,
  type LinkCache
} from 'obsidian'

const isFile = (file: any): file is TFile =>
  file instanceof TFile

const isFolder = (file: any): file is TFolder =>
  file instanceof TFolder

export const getAllFiles = (
  file: TAbstractFile | null
): TFile[] => {
  let files: TFile[] = []

  if (!isFolder(file)) return files

  file.children.forEach((child) => {
    if (isFile(child)) {
      files.push(child)
    } else if (isFolder(child)) {
      files = files.concat(getAllFiles(child))
    }
  })

  return files
}

export const getMetadata = (app: App, file: TFile) =>
  app.metadataCache.getFileCache(file)

export const filterFilesByTag = (
  app: App,
  files: TFile[],
  tag: string
): TFile[] =>
  files.filter((file) =>
    getMetadata(app, file)?.frontmatter?.tags?.some(
      (t: string) => t === tag
    )
  )

export const getFilesLinks = (
  app: App,
  files: TFile[]
): Set<string> =>
  new Set(
    files
      .map((file) => getMetadata(app, file)?.links || [])
      .flat()
      .map((link) => link.link)
  )
