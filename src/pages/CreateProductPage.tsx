import { useProductsStore } from '@/store/products'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type FormData = {
	title: string
	description: string
	price: string
	image: string
	ratingRate: string
	ratingCount: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function CreateProductPage() {
	const navigate = useNavigate()
	const { createProduct } = useProductsStore()
	const [formData, setFormData] = useState<FormData>({
		title: '',
		description: '',
		price: '',
		image: '',
		ratingRate: '0',
		ratingCount: '0',
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const validate = (): boolean => {
		const newErrors: FormErrors = {}

		if (!formData.title.trim()) {
			newErrors.title = 'Название обязательно'
		} else if (formData.title.trim().length < 3) {
			newErrors.title = 'Название должно быть не менее 3 символов'
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Описание обязательно'
		} else if (formData.description.trim().length < 10) {
			newErrors.description = 'Описание должно быть не менее 10 символов'
		}

		const price = parseFloat(formData.price)
		if (!formData.price.trim()) {
			newErrors.price = 'Цена обязательна'
		} else if (isNaN(price) || price <= 0) {
			newErrors.price = 'Цена должна быть положительным числом'
		}

		if (!formData.image.trim()) {
			newErrors.image = 'URL изображения обязателен'
		} else {
			try {
				new URL(formData.image)
			} catch {
				newErrors.image = 'Введите корректный URL'
			}
		}

		const ratingRate = parseFloat(formData.ratingRate)
		if (isNaN(ratingRate) || ratingRate < 0 || ratingRate > 5) {
			newErrors.ratingRate = 'Рейтинг должен быть от 0 до 5'
		}

		const ratingCount = parseInt(formData.ratingCount)
		if (isNaN(ratingCount) || ratingCount < 0) {
			newErrors.ratingCount =
				'Количество отзывов должно быть неотрицательным числом'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		setIsSubmitting(true)
		try {
			const product = await createProduct({
				title: formData.title.trim(),
				description: formData.description.trim(),
				price: parseFloat(formData.price),
				image: formData.image.trim(),
				rating: {
					rate: parseFloat(formData.ratingRate),
					count: parseInt(formData.ratingCount),
				},
			})
			navigate(`/products/${product.id}`)
		} catch (error) {
			console.error('Ошибка при создании продукта:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleChange =
		(field: keyof FormData) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData(prev => ({ ...prev, [field]: e.target.value }))
			if (errors[field]) {
				setErrors(prev => ({ ...prev, [field]: undefined }))
			}
		}

	return (
		<div className='create-product-page'>
			<div className='create-product-container'>
				<h1>Создать продукт</h1>
				<form onSubmit={handleSubmit} className='product-form' noValidate>
					<div className='form-group'>
						<label htmlFor='title'>
							Название <span className='required'>*</span>
						</label>
						<input
							id='title'
							name='title'
							type='text'
							value={formData.title}
							onChange={handleChange('title')}
							className={errors.title ? 'error' : ''}
							placeholder='Введите название продукта'
							autoComplete='off'
							data-form-type='other'
						/>
						{errors.title && (
							<span className='error-message'>{errors.title}</span>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='description'>
							Описание <span className='required'>*</span>
						</label>
						<textarea
							id='description'
							name='description'
							value={formData.description}
							onChange={handleChange('description')}
							className={errors.description ? 'error' : ''}
							placeholder='Введите описание продукта'
							rows={4}
							autoComplete='off'
							data-form-type='other'
						/>
						{errors.description && (
							<span className='error-message'>{errors.description}</span>
						)}
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='price'>
								Цена <span className='required'>*</span>
							</label>
							<input
								id='price'
								name='price'
								type='number'
								step='0.01'
								min='0'
								value={formData.price}
								onChange={handleChange('price')}
								className={errors.price ? 'error' : ''}
								placeholder='0.00'
								autoComplete='off'
								data-form-type='other'
							/>
							{errors.price && (
								<span className='error-message'>{errors.price}</span>
							)}
						</div>

						<div className='form-group'>
							<label htmlFor='image'>
								URL изображения <span className='required'>*</span>
							</label>
							<input
								id='image'
								name='image'
								type='url'
								value={formData.image}
								onChange={handleChange('image')}
								className={errors.image ? 'error' : ''}
								placeholder='https://example.com/image.jpg'
								autoComplete='off'
								data-form-type='other'
							/>
							{errors.image && (
								<span className='error-message'>{errors.image}</span>
							)}
						</div>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='ratingRate'>Рейтинг (0-5)</label>
							<input
								id='ratingRate'
								name='ratingRate'
								type='number'
								step='0.1'
								min='0'
								max='5'
								value={formData.ratingRate}
								onChange={handleChange('ratingRate')}
								className={errors.ratingRate ? 'error' : ''}
								autoComplete='off'
								data-form-type='other'
							/>
							{errors.ratingRate && (
								<span className='error-message'>{errors.ratingRate}</span>
							)}
						</div>

						<div className='form-group'>
							<label htmlFor='ratingCount'>Количество отзывов</label>
							<input
								id='ratingCount'
								name='ratingCount'
								type='number'
								min='0'
								value={formData.ratingCount}
								onChange={handleChange('ratingCount')}
								className={errors.ratingCount ? 'error' : ''}
								autoComplete='off'
								data-form-type='other'
							/>
							{errors.ratingCount && (
								<span className='error-message'>{errors.ratingCount}</span>
							)}
						</div>
					</div>

					<div className='form-actions'>
						<button
							type='button'
							className='btn-back'
							onClick={() => navigate(-1)}
							disabled={isSubmitting}
						>
							Отмена
						</button>
						<button
							type='submit'
							className='btn-submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Сохранение...' : 'Создать продукт'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
