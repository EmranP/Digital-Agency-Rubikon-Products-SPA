import { IRatingProps } from '@/types'
import { FC } from 'react'

export const Rating: FC<IRatingProps> = ({
	rate,
	count,
	showCount = false,
}) => {
	const fullStars = Math.floor(rate)
	const hasHalfStar = rate % 1 >= 0.5
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

	return (
		<div className='rating'>
			<div className='rating-stars' aria-label={`Рейтинг: ${rate} из 5`}>
				{Array.from({ length: fullStars }).map((_, i) => (
					<span key={i} className='star filled'>
						★
					</span>
				))}
				{hasHalfStar && <span className='star half'>★</span>}
				{Array.from({ length: emptyStars }).map((_, i) => (
					<span key={i} className='star empty'>
						★
					</span>
				))}
			</div>
			{showCount && count !== undefined && (
				<span className='rating-count'>({count})</span>
			)}
		</div>
	)
}
