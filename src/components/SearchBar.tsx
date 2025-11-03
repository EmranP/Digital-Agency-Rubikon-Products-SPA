import { ISearchBarProps } from '@/types'
import { FC } from 'react'

export const SearchBar: FC<ISearchBarProps> = ({ value, onChange }) => {
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
