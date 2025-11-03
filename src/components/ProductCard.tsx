import { Product } from '@/types'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'

type Props = {
	product: Product
	liked: boolean
	isDeleting?: boolean
	onToggleLike: (id: number) => void
	onDelete: (id: number) => Promise<void>
}

export default function ProductCard({
	product,
	liked,
	isDeleting = false,
	onToggleLike,
	onDelete,
}: Props) {
	const navigate = useNavigate()

	const goToDetails = () => navigate(`/products/${product.id}`)

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		await onDelete(product.id)
	}

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigate(`/edit-product/${product.id}`)
	}

	return (
		<div
			className={`card ${isDeleting ? 'deleting' : ''}`}
			onClick={goToDetails}
			role='button'
			aria-label={`Открыть ${product.title}`}
		>
			<div className='card-actions'>
				<button
					className={`icon-btn like ${liked ? 'active' : ''}`}
					aria-pressed={liked}
					aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
					onClick={e => {
						e.stopPropagation()
						onToggleLike(product.id)
					}}
					disabled={isDeleting}
				>
					♥
				</button>
				<button
					className='icon-btn'
					aria-label='Редактировать карточку'
					onClick={handleEdit}
					disabled={isDeleting}
				>
					✏️
				</button>
				<button
					className={`icon-btn ${isDeleting ? 'deleting' : ''}`}
					aria-label={isDeleting ? 'Удаление...' : 'Удалить карточку'}
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? '…' : '🗑'}
				</button>
			</div>
			<div className='card-media'>
				<img src={product.image} alt={product.title} loading='lazy' />
			</div>
			<div className='card-body'>
				<div className='title'>{product.title}</div>
				<Rating rate={product.rating.rate} count={product.rating.count} />
				<div className='desc'>{product.description}</div>
				<div className='price'>${product.price.toFixed(2)}</div>
			</div>
		</div>
	)
}
