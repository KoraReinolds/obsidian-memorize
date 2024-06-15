import {
  App,
  TAbstractFile,
  TFile,
  TFolder
} from 'obsidian'
import type { TLinks } from './types'
import { getRandomValueBetween } from '@/lib'

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

export const filterFilesByLinks = (
  files: TFile[],
  links: TLinks = new Set()
): TFile[] =>
  files.filter((file) => links.has(file.basename))

export const getFilesLinks = (
  app: App,
  files: TFile[]
): TLinks =>
  new Set(
    files
      .map((file) => getMetadata(app, file)?.links || [])
      .flat()
      .map((link) => link.link)
  )

export const getRandomFile = (files: TFile[]) =>
  files[getRandomValueBetween(0, files.length - 1)]
