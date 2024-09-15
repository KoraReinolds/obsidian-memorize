import MemoPlugin from '../../main'
import { App, PluginSettingTab, Setting } from 'obsidian'
import {
	DEFAULT_SETTINGS,
	type TMode,
	type TSettings
} from './types'
import { v4 as uuidv4 } from 'uuid'

export class MemoSetting extends PluginSettingTab {
	plugin: MemoPlugin
	list: HTMLElement | undefined

	constructor(app: App, plugin: MemoPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	expandedBlocks: Record<string, boolean> = {}

	renderList(
		list: {
			id: string
			name: string
			settings: TSettings
		}[]
	) {
		if (!this.list) return

		const containerEl = this.containerEl.appendChild(
			this.list
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
							card: 'card'
						})
						.setValue(settings.mode)
						.onChange((value) => {
							settings.mode = value as TMode
							this.plugin.saveSettings()
						})
				)
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
		})
	}

	display(): void {
		const { containerEl } = this

		const list = this.plugin.settings.list

		containerEl.empty()

		this.list = containerEl.createDiv()

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
