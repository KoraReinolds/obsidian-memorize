export const getRandomValueBetween = (
	min: number,
	max: number
) => {
	if (min > max) {
		throw new Error(
			'min should be less than or equal to max'
		)
	}
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomItem = <T>(items: T[]): T | null => {
	return items.length
		? items[getRandomValueBetween(0, items.length - 1)]
		: null
}

export const toArray = (input: any) => {
	if (
		input === null ||
		typeof input !== 'object' ||
		Array.isArray(input)
	) {
		return Array.isArray(input) ? input : [input]
	} else {
		throw new Error(
			'Input is a complex value and cannot be converted to an array'
		)
	}
}
