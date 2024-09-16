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
