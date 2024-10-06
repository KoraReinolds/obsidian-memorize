import MemoPlugin from '../../main'
import { App, PluginSettingTab, Setting } from 'obsidian'
import {
	DEFAULT_SETTINGS,
	TDisplayType,
	TSuggestionSettings,
	type TMode,
	type TSettings
} from './types'
import { v4 as uuidv4 } from 'uuid'

export class MemoSetting extends PluginSettingTab {
	plugin: MemoPlugin
	listEl: HTMLElement | undefined

	constructor(app: App, plugin: MemoPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	expandedBlocks: Record<string, boolean> = {}
	suggestionSettingsEl: Record<string, HTMLElement> = {}

	renderSugestionSettings(
		containerEl: HTMLElement,
		settings: TSuggestionSettings,
		mode: TMode
	) {
		if (!containerEl || !this.listEl) return

		if (mode !== 'list') return

		this.listEl.appendChild(containerEl)
		containerEl.innerHTML = ''

		containerEl.createEl('h1').innerHTML = 'List range'

		new Setting(containerEl)
			.setName('Min')
			.setDesc(
				'The minimum number of correct answers in the selection list'
			)
			.addText((text) =>
				text
					.setValue(`${settings.range.min ?? 1}`)
					.setPlaceholder('Type min')
					.onChange(async (value) => {
						settings.range.min = +value
						this.plugin.saveSettings()
					})
			)

		new Setting(containerEl)
			.setName('Max')
			.setDesc(
				'The maximum number of correct answers in the selection list'
			)
			.addText((text) =>
				text
					.setValue(`${settings.range.max ?? 2}`)
					.setPlaceholder('Type max')
					.onChange(async (value) => {
						settings.range.max = +value
						this.plugin.saveSettings()
					})
			)

		new Setting(containerEl)
			.setName('Total')
			.setDesc(
				'The total number of answers in the selection list'
			)
			.addText((text) =>
				text
					.setValue(`${settings.total ?? 4}`)
					.setPlaceholder('Type total')
					.onChange(async (value) => {
						if (!Number.isInteger(value)) {
							text.setValue(`${Number.parseInt(value)}`)
						}
						settings.total = +value
						this.plugin.saveSettings()
					})
			)
	}

	renderList(
		list: {
			id: string
			name: string
			settings: TSettings
		}[]
	) {
		if (!this.listEl) return

		this.listEl.innerHTML = ''

		const containerEl = this.containerEl.appendChild(
			this.listEl
		)

		list.forEach((memoSettings) => {
			const { name, settings, id } = memoSettings

			const header = new Setting(containerEl)
				.setName(name)
				.addText((text) =>
					text
						.setValue(name)
						.setPlaceholder('Type name of block')
						.onChange((value) => {
							memoSettings.name = value
							header.setName(value)
							this.plugin.saveSettings()
						})
				)
				.addButton((btn) => {
					const hidden = !this.expandedBlocks[id]
					btn
						.setIcon(hidden ? 'eye' : 'eye-off')
						.onClick(() => {
							this.expandedBlocks[id] = hidden
							this.display()
						})
				})
				.addButton((btn) => {
					btn.setIcon('trash-2').onClick(() => {
						this.plugin.settings.list =
							this.plugin.settings.list.filter(
								(item) => item.id !== id
							)

						this.plugin.saveSettings()
						this.display()
					})
				})

			const div = containerEl.createEl('div')

			if (!this.expandedBlocks[id]) return

			if (!this.suggestionSettingsEl[id]) {
				this.suggestionSettingsEl[id] = div.createDiv()
			}

			div.createEl('br')

			new Setting(div)
				.setName('FROM dataview query')
				.setDesc(
					'Equivalent to FROM from dataview plugin to find files'
				)
				.addText((text) =>
					text
						.setPlaceholder('Type FROM query')
						.setValue(settings.fromQuery)
						.onChange(async (value) => {
							settings.fromQuery = value
							this.plugin.saveSettings()
						})
				)

			new Setting(div)
				.setName('Filter function')
				.setDesc(
					'Filters found files for a more specific selection (optional)'
				)
				.addText((text) =>
					text
						.setValue(settings.filterPath)
						.setPlaceholder('Type filter function')
						.onChange(async (value) => {
							settings.filterPath = value
							this.plugin.saveSettings()
						})
				)

			new Setting(div)
				.setName('Type')
				.setDesc(
					'Defines the logic of interaction with selected pages'
				)
				.addDropdown((dd) =>
					dd
						.addOptions({
							card: 'Card',
							list: 'List',
							badges: 'Badges'
						})
						.setValue(settings.mode)
						.onChange((value) => {
							settings.mode = value as TMode
							this.plugin.saveSettings()
							this.renderList(list)
						})
				)

			div.createEl('hr')
			div.createEl('h1').innerHTML = 'Key'

			new Setting(div)
				.setName('Property for association')
				.setDesc(
					'A property of the found page that will be displayed and become the key to your memories'
				)
				.addText((text) =>
					text
						.setValue(
							settings.associationKey.displayProperty
						)
						.setPlaceholder('Type key property')
						.onChange(async (value) => {
							settings.associationKey.displayProperty =
								value
							this.plugin.saveSettings()
						})
				)

			div.createEl('hr')
			div.createEl('h1').innerHTML = 'Suggestions'

			new Setting(div)
				.setName('Property for memorization')
				.setDesc(
					'A property of the found page you want to memorize'
				)
				.addText((text) =>
					text
						.setValue(settings.suggestion.displayProperty)
						.setPlaceholder('Type property')
						.onChange(async (value) => {
							settings.suggestion.displayProperty = value
							this.plugin.saveSettings()
						})
				)

			const suggestionDisplayType = new Setting(div)
				.setName('Type of display')
				.setDesc('Define how to display property')
				.addDropdown((dd) =>
					dd
						.addOptions({
							text: 'Text',
							script: 'Script'
						})
						.setValue(settings.suggestion.displayType)
						.onChange((value) => {
							settings.suggestion.displayType =
								value as TDisplayType
							this.plugin.saveSettings()
							this.renderList(list)
						})
				)

			if (settings.suggestion.displayType === 'script')
				suggestionDisplayType.addText((text) =>
					text
						.setValue(
							settings.suggestion.additionalSettings
								.scriptPath
						)
						.setPlaceholder('Type script path')
						.onChange(async (value) => {
							settings.suggestion.additionalSettings.scriptPath =
								value
							this.plugin.saveSettings()
						})
				)

			this.renderSugestionSettings(
				this.suggestionSettingsEl[id],
				settings.suggestion.additionalSettings,
				settings.mode
			)

			div.createEl('br')
			div.createEl('br')

			new Setting(containerEl)
				.setName('Logs')
				.addButton((btn) => {
					btn.setIcon('plus').onClick(() => {
						memoSettings.settings.logs.push({
							id: uuidv4(),
							key: '',
							value: '',
							type: 'metadata'
						})
						this.plugin.saveSettings()
						this.display()
					})
				})

			memoSettings.settings.logs.forEach((log) => {
				new Setting(containerEl)
					.addText((text) =>
						text
							.setValue(log.key)
							.setPlaceholder('Type metadata key')
							.onChange((value) => {
								log.key = value
								this.plugin.saveSettings()
							})
					)
					.addText((text) =>
						text
							.setValue(log.value)
							.setPlaceholder('Type template for logging')
							.onChange((value) => {
								log.value = value
								this.plugin.saveSettings()
							})
					)
					.addButton((btn) => {
						btn.setIcon('trash-2').onClick(() => {
							memoSettings.settings.logs =
								memoSettings.settings.logs.filter(
									(item) => item.id !== log.id
								)

							this.plugin.saveSettings()
							this.display()
						})
					})
			})
		})
	}

	display(): void {
		const { containerEl } = this

		const list = this.plugin.settings.list

		containerEl.empty()

		this.listEl = containerEl.createDiv()

		new Setting(containerEl)
			.setName('List of logic block')
			.setDesc(
				'Every block contains specific logic you can reuse'
			)
			.addButton((btn) =>
				btn
					.setButtonText('Add new block')
					.onClick(async () => {
						list.push({
							id: uuidv4(),
							name: '',
							settings: DEFAULT_SETTINGS
						})
						this.plugin.saveSettings()
						this.display()
					})
			)

		containerEl.createEl('hr')

		this.renderList(list)
	}
}
