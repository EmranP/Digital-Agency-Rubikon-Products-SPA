type Props = {
	value: 'all' | 'favorites'
	onChange: (value: 'all' | 'favorites') => void
	countAll: number
	countFav: number
}

export default function FilterBar({
	value,
	onChange,
	countAll,
	countFav,
}: Props) {
	return (
		<div className='toolbar'>
			<div className='filter' role='tablist' aria-label='Фильтр'>
				<button
					role='tab'
					aria-selected={value === 'all'}
					className={value === 'all' ? 'active' : ''}
					onClick={() => onChange('all')}
				>
					Все ({countAll})
				</button>
				<button
					role='tab'
					aria-selected={value === 'favorites'}
					className={value === 'favorites' ? 'active' : ''}
					onClick={() => onChange('favorites')}
				>
					Избранные ({countFav})
				</button>
			</div>
		</div>
	)
}
