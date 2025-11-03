import { Rating } from '@/components/Rating'
import { useProductsStore } from '@/store/products'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ProductDetailsPage() {
	const navigate = useNavigate()
	const params = useParams()
	const id = Number(params.id)

	const { fetchProducts, getById, toggleFavorite, favorites } =
		useProductsStore()
	const product = getById(id)

	useEffect(() => {
		void fetchProducts()
	}, [fetchProducts])

	if (!Number.isFinite(id)) {
		navigate('/products', { replace: true })
		return null
	}

	if (!product) {
		return (
			<div className='center' style={{ height: 220 }}>
				<div className='muted'>Загрузка карточки…</div>
			</div>
		)
	}

	const liked = !!favorites[product.id]

	return (
		<div
			className='product-details-page'
			style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}
		>
			<div
				className='card-media product-details-image'
				style={{
					border: '1px solid #eee',
					borderRadius: 14,
					overflow: 'hidden',
				}}
			>
				<img src={product.image} alt={product.title} />
			</div>
			<div className='product-details-content'>
				<h1 style={{ margin: '8px 0 12px' }}>{product.title}</h1>
				<Rating
					rate={product.rating.rate}
					count={product.rating.count}
					showCount
				/>
				<div style={{ color: '#555', marginBottom: 12 }}>
					{product.description}
				</div>
				<div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
					${product.price.toFixed(2)}
				</div>
				<div className='product-actions'>
					<button
						className={`btn-favorite ${liked ? 'active' : ''}`}
						onClick={() => toggleFavorite(product.id)}
					>
						<span className='btn-icon'>♥</span>
						<span>{liked ? 'В избранном' : 'В избранное'}</span>
					</button>
					<button className='btn-back' onClick={() => navigate(-1)}>
						<span className='btn-icon'>←</span>
						<span>Назад</span>
					</button>
				</div>
			</div>
		</div>
	)
}
