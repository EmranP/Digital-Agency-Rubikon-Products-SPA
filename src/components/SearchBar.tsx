type Props = {
	value: string
	onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
	return (
		<div className='search-bar'>
			<input
				type='text'
				placeholder='Поиск по названию или описанию...'
				value={value}
				onChange={e => onChange(e.target.value)}
				className='search-input'
			/>
		</div>
	)
}
