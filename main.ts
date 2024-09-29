import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	TFile
} from 'obsidian'
import {
	getRandomItem,
	getRandomValueBetween,
	toArray
} from 'src/lib'
import { MemoSetting } from 'src/settings'
import {
	DEFAULT_MEMO_SETTINGS,
	MemoPluginSettings,
	TMode,
	TSettings
} from 'src/settings/types'
import { parse } from 'yaml'

export type TItem = Record<string, any> & { file: TFile }
export type TDisplayItem = {
	value: string
	correct: boolean
	displayValue: string
	selected: boolean
}

export default class Memo extends Plugin {
	settings: MemoPluginSettings
	_settings: TSettings
	_dv: any
	_pages: TItem[]
	_associations: string[]
	_associationFile: TItem | undefined
	_suggestions: string[]
	_unrelatedSuggestions: string[]

	getBadgeItems(suggestions: string[]): TDisplayItem[] {
		const associations = this._associations.shuffle()
		if (!associations) return []
		const associationItem = associations[0]
		if (!associationItem) return []

		const suggestionItems = suggestions
			.map((item) => item.split(' '))
			.flat()
			.map((item) => {
				return {
					value: item,
					displayValue: item.toLocaleLowerCase(),
					correct: true,
					selected: false
				}
			})

		return suggestionItems.shuffle()
	}

	getListItems(): TDisplayItem[] {
		const rangeSettings =
			this._settings.suggestion.additionalSettings

		const associations = this._associations.shuffle()
		if (!associations) return []
		const associationItem = associations[0]
		if (!associationItem) return []

		const min = rangeSettings.range.min
		const max = getRandomValueBetween(
			+min,
			+rangeSettings.range.max
		)

		const suggestionItems = this._suggestions
			.slice(0, max)
			.map((item) => {
				return {
					value: item,
					correct: true,
					displayValue: item,
					selected: false
				}
			})

		const unrelatedDuggestionItems =
			this._unrelatedSuggestions
				.slice(
					0,
					+rangeSettings.total - +suggestionItems.length
				)
				.map((item) => {
					return {
						value: item,
						correct: false,
						displayValue: item,
						selected: false
					}
				})

		return [
			...unrelatedDuggestionItems,
			...suggestionItems
		].shuffle()
	}

	displayBottomPanel(
		el: HTMLElement,
		callbacks: {
			checkCallback: (e: Event) => void
			nextCallback: (e: Event) => void
		}
	) {
		const { checkCallback, nextCallback } = callbacks
		const panel = el.createDiv()
		panel.className = 'memo-bottom-panel'

		const checkBtn = panel.createEl('button')
		checkBtn.type = 'submit'
		checkBtn.className = 'memo-button'
		checkBtn.innerText = 'Check'
		checkBtn.addEventListener('click', checkCallback)

		const nextBtn = panel.createEl('button')
		nextBtn.innerText = 'Next'
		nextBtn.className = 'memo-button'
		nextBtn.addEventListener('click', nextCallback)
	}

	getAssociation() {
		const pages = this._pages

		const page = getRandomItem(pages)

		if (!page) throw new Error(`Nothing found for display`)
		this._associationFile = page

		return page
	}

	renderCard(el: HTMLElement) {
		el.innerHTML = ''
		// eslint-disable-next-line
		const p = this.getAssociation()

		const associations = toArray(
			eval(this._settings.associationKey.displayProperty)
		)
		this._associations = associations

		const suggestions = toArray(
			eval(this._settings.suggestion.displayProperty)
		)
		this._suggestions = suggestions

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

		const toggleCard = () => {
			answersDiv.style.display =
				answersDiv.style.display === 'none'
					? 'block'
					: 'none'
		}
		card.addEventListener('click', toggleCard)

		el.appendChild(card)

		this.displayBottomPanel(el, {
			checkCallback: (e: Event) => {
				e.preventDefault()
				toggleCard()
			},
			nextCallback: (e: Event) => {
				e.preventDefault()
				this.renderCard(el)
			}
		})
	}

	renderList(el: HTMLElement) {
		el.innerHTML = ''
		// eslint-disable-next-line
		const p = this.getAssociation()

		const associations = toArray(
			eval(this._settings.associationKey.displayProperty)
		)
		this._associations = associations

		const suggestions = toArray(
			eval(this._settings.suggestion.displayProperty)
		)
		this._suggestions = suggestions

		{
			// eslint-disable-next-line
			const p = this._pages
			const allSuggestions = eval(
				this._settings.suggestion.displayProperty
			)
			this._unrelatedSuggestions = allSuggestions.filter(
				(item: string) => !this._suggestions.includes(item)
			)
		}

		const card = document.createElement('div')
		card.className = 'memo-card'
		card.textContent = associations.join(', ')
		el.appendChild(card)

		const form = el.createEl('form')

		const ul = form.createEl('ul')
		this.getListItems().forEach((item) => {
			const li = ul.createEl('li')
			li.setAttr('correct', item.correct)

			const checkbox = li.createEl('input')
			const id = `${Math.random()}`
			checkbox.id = id
			checkbox.type = 'checkbox'
			checkbox.name = item.value
			const label = li.createEl('label')
			label.innerHTML = item.value
			label.setAttr('for', id)
		})

		form.onsubmit = (e) => {
			e.preventDefault()
			form.setAttr('submitted', true)
		}

		this.displayBottomPanel(form, {
			checkCallback: (e) => {},
			nextCallback: (e) => {
				e.preventDefault()
				this.renderList(el)
			}
		})
	}

	renderBadges(el: HTMLElement) {
		el.innerHTML = ''
		// eslint-disable-next-line
		const p = this.getAssociation()

		const associations = toArray(
			eval(this._settings.associationKey.displayProperty)
		)
		this._associations = associations

		const suggestions = toArray(
			eval(this._settings.suggestion.displayProperty)
		)
		this._suggestions = suggestions

		{
			// eslint-disable-next-line
			const p = this._pages
			const allSuggestions = eval(
				this._settings.suggestion.displayProperty
			)
			this._unrelatedSuggestions = allSuggestions.filter(
				(item: string) => !this._suggestions.includes(item)
			)
		}

		const card = document.createElement('div')
		card.className = 'memo-card'
		card.textContent = associations.join(', ')
		el.appendChild(card)

		const form = el.createEl('form')
		const container = form.createEl('div')
		container.addClass('memo-badge-container')

		let counter = 1

		const suggestion = suggestions.shuffle()[0]
		const badgeItems = this.getBadgeItems([suggestion])

		badgeItems.forEach((item) => {
			const span = container.createEl('span')
			span.style.order = ''
			span.onclick = () => {
				item.selected = !item.selected
				span.style.order = span.style.order
					? ''
					: `${counter++}`
			}
			span.setAttr('value', item.value)
			span.classList.add('memo-badge')

			span.innerHTML = item.displayValue
		})
		const div = container.createDiv()
		div.classList.add('memo-divider')
		div.createDiv()

		form.onsubmit = (e) => {
			e.preventDefault()
			form.setAttr('submitted', true)

			const badges = Array.from(
				document.querySelectorAll('.memo-badge')
			)
				.filter((badge) => {
					const orderValue = window
						.getComputedStyle(badge)
						.getPropertyValue('order')

					return orderValue !== '0'
				})
				.sort((a, b) => {
					const orderA = parseInt(
						window
							.getComputedStyle(a)
							.getPropertyValue('order'),
						10
					)
					const orderB = parseInt(
						window
							.getComputedStyle(b)
							.getPropertyValue('order'),
						10
					)
					return orderA - orderB
				})

			const correctBadges = suggestion.split(' ')

			badges.forEach((el, i) => {
				el.setAttr(
					el.getAttr('value') === correctBadges[i]
						? 'correct'
						: 'wrong',
					true
				)
			})
		}

		this.displayBottomPanel(form, {
			checkCallback: async (e) => {
				const tp = (this.app as any).plugins.plugins[
					'templater-obsidian'
				]?.templater.current_functions_object
				if (tp) {
					this._settings.logs.forEach((log) => {
						if (this._associationFile?.file)
							this.addMetadata(
								this._associationFile.file,
								log.key,
								eval(log.value)
							)
					})
				} else {
					console.error(
						'Templater плагин не установлен или не активен'
					)
				}
			},
			nextCallback: (e) => {
				e.preventDefault()
				this.renderBadges(el)
			}
		})
	}

	async addMetadata(f: TFile, key: string, value: string) {
		const file = await this.app.vault.getAbstractFileByPath(
			f.path
		)
		if (!file || !(file instanceof TFile)) return

		const fileContent = await this.app.vault.read(file)

		const frontmatterRegex = /^---\n([\s\S]*?)\n---/
		const match = frontmatterRegex.exec(fileContent)

		let newContent

		if (match) {
			let frontmatter = match[1]

			const keyRegex = new RegExp(`^${key}:.*`, 'm')
			if (keyRegex.test(frontmatter)) {
				frontmatter = frontmatter.replace(
					keyRegex,
					`${key}: "${value}"`
				)
			} else {
				frontmatter += `\n${key}: "${value}"`
			}

			newContent = fileContent.replace(
				match[0],
				`---\n${frontmatter}\n---`
			)
		} else {
			newContent = `---\n${key}: "${value}"\n---\n\n${fileContent}`
		}

		await this.app.vault.modify(file, newContent)
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

					const cssContent = await this.loadCSSFile(
						'src/assets/index.css'
					)
					this.injectCSS(cssContent)

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
						// @ts-ignore
						(p) =>
							eval(settings.associationKey.displayProperty)
								.length &&
							eval(settings.suggestion.displayProperty)
								.length &&
							(settings.filterPath
								? eval(settings.filterPath)
								: true)
					)

					this._pages = pages

					const mode: TMode = settings.mode

					console.log(this)
					if (mode === 'card') this.renderCard(el)
					else if (mode === 'list') this.renderList(el)
					else if (mode === 'badges') this.renderBadges(el)
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
