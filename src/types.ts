// Store
export type TypeFilter = 'all' | 'favorites'

export interface IFilterOptions {
	priceMin: number | null
	priceMax: number | null
	ratingMin: number | null
}

export interface IProductRating {
	rate: number
	count: number
}

export type Product = {
	id: number
	title: string
	description: string
	price: number
	image: string
	rating: IProductRating
}

// Filters
export type FilterOptions = {
	priceMin: number | null
	priceMax: number | null
	ratingMin: number | null
}

export interface IAdvancedFiltersProps {
	options: FilterOptions
	onChange: (options: Partial<FilterOptions>) => void
}

// Filter Bar

export interface IFilterBarProps {
	value: 'all' | 'favorites'
	onChange: (value: 'all' | 'favorites') => void
	countAll: number
	countFav: number
}

// Pagination

export interface IPaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

// Product Card
export interface IProductCardProps {
	product: Product
	liked: boolean
	isDeleting?: boolean
	onToggleLike: (id: number) => void
	onDelete: (id: number) => Promise<void>
}

// Rating
export interface IRatingProps {
	rate: number
	count?: number
	showCount?: boolean
}

// Search-bar
export interface ISearchBarProps {
	value: string
	onChange: (value: string) => void
}

// Create Product
export interface IFormData {
	title: string
	description: string
	price: string
	image: string
	ratingRate: string
	ratingCount: string
}

export type TypeFormErrors = Partial<Record<keyof IFormData, string>>
