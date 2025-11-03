import type { FilterOptions, IAdvancedFiltersProps } from '@/types'
import type { ChangeEvent, FC } from 'react'

export const AdvancedFilters: FC<IAdvancedFiltersProps> = ({
	options,
	onChange,
}) => {
	const handleChange =
		(field: keyof FilterOptions) => (e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			onChange({
				[field]: value === '' ? null : parseFloat(value),
			})
		}

	return (
		<div className='advanced-filters'>
			<h3 className='filters-title'>Дополнительные фильтры</h3>
			<div className='filters-grid'>
				<div className='filter-group'>
					<label htmlFor='priceMin'>Минимальная цена</label>
					<input
						id='priceMin'
						type='number'
						step='0.01'
						min='0'
						value={options.priceMin ?? ''}
						onChange={handleChange('priceMin')}
						placeholder='0.00'
					/>
				</div>
				<div className='filter-group'>
					<label htmlFor='priceMax'>Максимальная цена</label>
					<input
						id='priceMax'
						type='number'
						step='0.01'
						min='0'
						value={options.priceMax ?? ''}
						onChange={handleChange('priceMax')}
						placeholder='Без ограничений'
					/>
				</div>
				<div className='filter-group'>
					<label htmlFor='ratingMin'>Минимальный рейтинг</label>
					<input
						id='ratingMin'
						type='number'
						step='0.1'
						min='0'
						max='5'
						value={options.ratingMin ?? ''}
						onChange={handleChange('ratingMin')}
						placeholder='0.0'
					/>
				</div>
			</div>
			<button
				className='btn-clear-filters'
				onClick={() =>
					onChange({ priceMin: null, priceMax: null, ratingMin: null })
				}
			>
				Сбросить фильтры
			</button>
		</div>
	)
}
