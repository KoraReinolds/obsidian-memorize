import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	TFile
} from 'obsidian'
import { getRandomItem } from 'src/lib'
import { MemoSetting } from 'src/settings'
import {
	DEFAULT_MEMO_SETTINGS,
	MemoPluginSettings,
	TSettings
} from 'src/settings/types'
import { parse } from 'yaml'

export type TItem = Record<string, any> & { file: TFile }

export default class Memo extends Plugin {
	settings: MemoPluginSettings
	_settings: TSettings
	_dv: any

	displayCard(p: TItem, el: HTMLElement) {
		const associations = eval(
			this._settings.associationKey.displayProperty
		)

		const suggestions = eval(
			this._settings.suggestion.displayProperty
		)

		const card = document.createElement('div')
		card.className = 'memo-card'
		card.textContent = Array.isArray(associations)
			? associations.join(', ')
			: associations

		const answersDiv = document.createElement('div')
		answersDiv.className = 'memo-answers'
		answersDiv.textContent = Array.isArray(suggestions)
			? suggestions.join(', ')
			: suggestions
		card.appendChild(answersDiv)
		answersDiv.style.display = 'none'

		card.addEventListener('click', () => {
			answersDiv.style.display =
				answersDiv.style.display === 'none'
					? 'block'
					: 'none'
		})

		el.appendChild(card)
	}

	async onload() {
		await this.loadSettings()
		this._dv = (
			this.app as any
		).plugins?.plugins.dataview.api

		const cssContent = await this.loadCSSFile(
			'src/assets/index.css'
		)
		this.injectCSS(cssContent)

		this.registerMarkdownCodeBlockProcessor(
			'memo',
			async (source, el, ctx) => {
				try {
					const userData = parse(source)

					const name = userData.name

					if (!name)
						throw new Error(
							"Can't find name property in the codeblock"
						)

					const settings = this.settings.list.find(
						(set) => set.name === name
					)?.settings

					if (settings) this._settings = settings

					if (!settings)
						throw new Error(
							`Can't find settings for "${name}"`
						)

					if (!settings.associationKey.displayProperty)
						throw new Error(
							`DisplayProperty for associationKey is required`
						)

					if (!settings.suggestion.displayProperty)
						throw new Error(
							`DisplayProperty for suggestion is required`
						)

					const p = await this._dv.pages(settings.fromQuery)
					const allAssociations = new Set(
						eval(settings.associationKey.displayProperty)
					)

					if (!allAssociations.size)
						throw new Error(
							`Nothing found for ${settings.associationKey.displayProperty}`
						)

					const allSuggestions = new Set(
						eval(settings.suggestion.displayProperty)
					)

					if (!allSuggestions.size)
						throw new Error(
							`Nothing found for ${settings.suggestion.displayProperty}`
						)

					const pages: TItem[] = p.filter(
						(p) =>
							eval(settings.associationKey.displayProperty)
								.length &&
							eval(settings.suggestion.displayProperty)
								.length
					)

					const page = getRandomItem(pages)

					if (page) this.displayCard(page, el)
					else {
						throw new Error(`Nothing found for display`)
					}
				} catch (err) {
					new Notice(err)
					el.innerHTML = 'Parsing error: \n' + err
				}
			}
		)

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			'dice',
			'Sample Plugin',
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice('This is a notice!')
			}
		)
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class')

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem()
		statusBarItemEl.setText('Status Bar Text')

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open()
			}
		})
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (
				editor: Editor,
				view: MarkdownView
			) => {
				console.log(editor.getSelection())
				editor.replaceSelection('Sample Editor Command')
			}
		})
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(
						MarkdownView
					)
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open()
					}

					// This command will only show up in Command Palette when the check function returns true
					return true
				}
			}
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MemoSetting(this.app, this))

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(
			document,
			'click',
			(evt: MouseEvent) => {
				console.log('click', evt)
			}
		)

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(
				() => console.log('setInterval'),
				5 * 60 * 1000
			)
		)
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_MEMO_SETTINGS,
			await this.loadData()
		)
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	async loadCSSFile(filename: string): Promise<string> {
		const path = `${this.manifest.dir}/${filename}`
		const data = await this.app.vault.adapter.read(path)
		return data
	}

	injectCSS(cssContent: string) {
		const style = document.createElement('style')
		style.type = 'text/css'
		style.id = `plugin-styles-${this.manifest.id}`
		document
			.querySelectorAll(`#${style.id}`)
			.forEach((style) => style.remove())
		style.innerHTML = cssContent
		document.head.appendChild(style)
	}

	removeInjectedCSS() {
		const id = `plugin-styles-${this.manifest.id}`
		const style = document.getElementById(id)
		if (style) {
			style.remove()
		}
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app)
	}

	onOpen() {
		const { contentEl } = this
		contentEl.setText('Woah!')
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}
