import { Plugin } from 'obsidian'

export default class MemoPlugin extends Plugin {
  async onload() {
    console.log('Hi from memo plugin!')
  }

  onunload() {}
}
