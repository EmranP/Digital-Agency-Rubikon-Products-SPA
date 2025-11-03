import { IFilterBarProps } from '@/types'
import { FC } from 'react'

export const FilterBar: FC<IFilterBarProps> = ({
	value,
	onChange,
	countAll,
	countFav,
}) => {
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
