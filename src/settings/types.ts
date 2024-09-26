export type TMode = 'card' | 'list' | 'badges'

export interface MemoPluginSettings {
	list: {
		id: string
		name: string
		settings: TSettings
	}[]
	selectedId: string
}

export const DEFAULT_MEMO_SETTINGS: MemoPluginSettings = {
	list: [],
	selectedId: ''
}

export const DEFAULT_SETTINGS: TSettings = {
	fromQuery: '',
	mode: 'card',
	filterPath: '',
	associationKey: {
		displayProperty: 'p.file.name'
	},
	suggestion: {
		displayProperty: '',
		additionalSettings: {
			range: {
				max: 2,
				min: 1
			},
			total: 4
		}
	}
}

export type TRangeSettings = {
	range: {
		max: number
		min: number
	}
	total: number
}

export type TSuggestionSettings = TRangeSettings

export type TSettings = {
	fromQuery: string
	mode: TMode
	filterPath: string
	associationKey: {
		displayProperty: string
	}
	suggestion: {
		displayProperty: string
		additionalSettings: TSuggestionSettings
	}
}

export type IMemoSettings = {
	list: {
		id: string
		name: string
		settings: TSettings
	}[]
}
