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
	acceptCallback: '',
	associationKey: {
		displayProperty: 'p.file.name'
	},
	suggestion: {
		displayProperty: '',
		displayType: 'text',
		additionalSettings: {
			scriptPath: '',
			range: {
				max: 2,
				min: 1
			},
			total: 4
		}
	},
	logs: []
}

export type TRangeSettings = {
	range: {
		max: number
		min: number
	}
	total: number
}

export type TScriptSettings = {
	scriptPath: string
}

export type TSuggestionSettings = TRangeSettings &
	TScriptSettings

export type TDisplayType = 'text' | 'script'

export type TLogSettings = {
	type: 'metadata'
	key: string
	value: string
	id: string
}

export type TSettings = {
	fromQuery: string
	mode: TMode
	filterPath: string
	acceptCallback: string
	associationKey: {
		displayProperty: string
	}
	suggestion: {
		displayProperty: string
		displayType: TDisplayType
		additionalSettings: TSuggestionSettings
	}
	logs: TLogSettings[]
}

export type IMemoSettings = {
	list: {
		id: string
		name: string
		settings: TSettings
	}[]
}
