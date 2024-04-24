export default function array<T>(value?: object): T[] | undefined {
	return value && Array.isArray(value) ? value : undefined
}