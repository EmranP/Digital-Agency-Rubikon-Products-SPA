import { AdvancedFilters } from '@/components/AdvancedFilters'
import { FilterBar } from '@/components/FilterBar'
import { Pagination } from '@/components/Pagination'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { useProductsStore } from '@/store/products'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
	const {
		fetchProducts,
		getPaginated,
		products,
		favorites,
		filter,
		searchQuery,
		filterOptions,
		currentPage,
		setFilter,
		setSearchQuery,
		setFilterOptions,
		setPage,
		toggleFavorite,
		deleteProduct,
		loading,
		deletingIds,
		error,
	} = useProductsStore()

	const [showFilters, setShowFilters] = useState(false)

	useEffect(() => {
		void fetchProducts()
	}, [fetchProducts])

	const { items, totalPages } = getPaginated()
	const countAll = products.length
	const countFav = products.filter(p => !!favorites[p.id]).length

	return (
		<div>
			<SearchBar value={searchQuery} onChange={setSearchQuery} />
			<div className='products-controls'>
				<FilterBar
					value={filter}
					onChange={setFilter}
					countAll={countAll}
					countFav={countFav}
				/>
				<button
					className='btn-toggle-filters'
					onClick={() => setShowFilters(!showFilters)}
				>
					{showFilters ? 'Скрыть фильтры' : 'Фильтры'}
				</button>
			</div>
			{showFilters && (
				<AdvancedFilters options={filterOptions} onChange={setFilterOptions} />
			)}
			{loading && (
				<div className='center muted' style={{ height: 200 }}>
					Загрузка…
				</div>
			)}
			{error && (
				<div className='center' style={{ height: 200 }}>
					<div className='muted'>Ошибка: {error}</div>
				</div>
			)}
			{!loading &&
				!error &&
				(items.length ? (
					<>
						<div className='grid'>
							{items.map(p => (
								<ProductCard
									key={p.id}
									product={p}
									liked={!!favorites[p.id]}
									isDeleting={deletingIds.has(p.id)}
									onToggleLike={toggleFavorite}
									onDelete={deleteProduct}
								/>
							))}
						</div>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</>
				) : (
					<div className='center' style={{ height: 200 }}>
						<div className='muted'>Нет карточек для отображения</div>
					</div>
				))}
		</div>
	)
}
