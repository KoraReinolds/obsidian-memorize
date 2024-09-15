export type TMode = 'card'

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
		displayProperty: ''
	}
}

export type TSettings = {
	fromQuery: string
	mode: TMode
	filterPath: string
	associationKey: {
		displayProperty: string
	}
	suggestion: {
		displayProperty: string
	}
}

export type IMemoSettings = {
	list: {
		id: string
		name: string
		settings: TSettings
	}[]
}
