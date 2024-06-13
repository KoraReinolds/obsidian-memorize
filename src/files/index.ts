import { TAbstractFile, TFile, TFolder } from 'obsidian'

const isFile = (file: any): file is TFile => file instanceof TFile

const isFolder = (file: any): file is TFolder => file instanceof TFolder

export const getAllFiles = (file: TAbstractFile | null): TFile[] => {
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
