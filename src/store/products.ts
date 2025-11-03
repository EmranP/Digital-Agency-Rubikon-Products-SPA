import { IFilterOptions, Product, TypeFilter } from '@/types'
import { create } from 'zustand'

const STORAGE_KEYS = {
	products: 'products-store',
	favorites: 'favorites-store',
} as const

const ITEMS_PER_PAGE = 12

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(key)
		return item ? JSON.parse(item) : defaultValue
	} catch {
		return defaultValue
	}
}

const saveToStorage = <T>(key: string, value: T): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch (error) {
		console.error(`Ошибка сохранения в localStorage (${key}):`, error)
	}
}

type ProductsState = {
	products: Product[]
	favorites: Record<number, true>
	filter: TypeFilter
	searchQuery: string
	filterOptions: IFilterOptions
	currentPage: number
	loading: boolean
	deletingIds: Set<number>
	error: string | null
	fetchProducts: () => Promise<void>
	toggleFavorite: (id: number) => void
	deleteProduct: (id: number) => Promise<void>
	createProduct: (product: Omit<Product, 'id'>) => Promise<Product>
	updateProduct: (
		id: number,
		product: Partial<Omit<Product, 'id'>>
	) => Promise<void>
	setFilter: (filter: TypeFilter) => void
	setSearchQuery: (query: string) => void
	setFilterOptions: (options: Partial<IFilterOptions>) => void
	setPage: (page: number) => void
	getById: (id: number) => Product | undefined
	getVisible: () => Product[]
	getPaginated: () => {
		items: Product[]
		totalPages: number
		currentPage: number
	}
}

const initialState = {
	products: loadFromStorage<Product[]>(STORAGE_KEYS.products, []),
	favorites: loadFromStorage<Record<number, true>>(STORAGE_KEYS.favorites, {}),
	filter: 'all' as TypeFilter,
	searchQuery: '',
	filterOptions: {
		priceMin: null,
		priceMax: null,
		ratingMin: null,
	} as IFilterOptions,
	currentPage: 1,
	loading: false,
	deletingIds: new Set<number>(),
	error: null,
}

export const useProductsStore = create<ProductsState>((set, get) => ({
	...initialState,
	async fetchProducts() {
		const cached = get().products
		if (cached.length) return
		set({ loading: true, error: null })
		try {
			const res = await fetch('https://fakestoreapi.com/products')
			if (!res.ok) throw new Error('Не удалось загрузить продукты')
			const data = (await res.json()) as any[]
			const products: Product[] = data.map(p => ({
				id: p.id,
				title: p.title,
				description: p.description,
				price: p.price,
				image: p.image,
				rating: {
					rate: p.rating?.rate || 0,
					count: p.rating?.count || 0,
				},
			}))
			set({ products, loading: false, error: null })
			saveToStorage(STORAGE_KEYS.products, products)
		} catch (e) {
			set({ loading: false, error: e instanceof Error ? e.message : 'Ошибка' })
		}
	},
	toggleFavorite(id) {
		const current = get().favorites
		const next = { ...current }
		if (next[id]) delete next[id]
		else next[id] = true
		set({ favorites: next })
		saveToStorage(STORAGE_KEYS.favorites, next)
	},
	async deleteProduct(id: number) {
		const deletingIds = new Set(get().deletingIds)
		deletingIds.add(id)
		set({ deletingIds })

		try {
			// Имитация асинхронного запроса на удаление
			// В реальном приложении здесь был бы fetch DELETE запрос
			await new Promise(resolve => setTimeout(resolve, 500))

			const products = get().products.filter(p => p.id !== id)
			const favorites = { ...get().favorites }
			if (favorites[id]) delete favorites[id]

			const updatedDeletingIds = new Set(get().deletingIds)
			updatedDeletingIds.delete(id)

			set({ products, favorites, deletingIds: updatedDeletingIds })
			saveToStorage(STORAGE_KEYS.products, products)
			saveToStorage(STORAGE_KEYS.favorites, favorites)
		} catch (error) {
			const updatedDeletingIds = new Set(get().deletingIds)
			updatedDeletingIds.delete(id)
			set({
				deletingIds: updatedDeletingIds,
				error: 'Ошибка при удалении продукта',
			})
		}
	},
	async createProduct(productData: Omit<Product, 'id'>) {
		const products = get().products
		const newId =
			products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
		const newProduct: Product = {
			id: newId,
			...productData,
		}
		const updatedProducts = [...products, newProduct]
		set({ products: updatedProducts, currentPage: 1 })
		saveToStorage(STORAGE_KEYS.products, updatedProducts)
		return newProduct
	},
	async updateProduct(id: number, productData: Partial<Omit<Product, 'id'>>) {
		const products = get().products
		const updatedProducts = products.map(p =>
			p.id === id ? { ...p, ...productData } : p
		)
		set({ products: updatedProducts })
		saveToStorage(STORAGE_KEYS.products, updatedProducts)
	},
	setFilter(filter) {
		set({ filter, currentPage: 1 })
	},
	setSearchQuery(query: string) {
		set({ searchQuery: query, currentPage: 1 })
	},
	setFilterOptions(options: Partial<IFilterOptions>) {
		set({
			filterOptions: { ...get().filterOptions, ...options },
			currentPage: 1,
		})
	},
	setPage(page: number) {
		set({ currentPage: page })
	},
	getById(id) {
		return get().products.find(p => p.id === id)
	},
	getVisible() {
		const { products, filter, favorites, searchQuery, filterOptions } = get()
		let result = products

		// Фильтр избранные/все
		if (filter === 'favorites') {
			result = result.filter(p => !!favorites[p.id])
		}

		// Поиск
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim()
			result = result.filter(
				p =>
					p.title.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query)
			)
		}

		// Фильтрация по цене
		if (filterOptions.priceMin !== null) {
			result = result.filter(p => p.price >= filterOptions.priceMin!)
		}
		if (filterOptions.priceMax !== null) {
			result = result.filter(p => p.price <= filterOptions.priceMax!)
		}

		// Фильтрация по рейтингу
		if (filterOptions.ratingMin !== null) {
			result = result.filter(p => p.rating.rate >= filterOptions.ratingMin!)
		}

		return result
	},
	getPaginated() {
		const visible = get().getVisible()
		const currentPage = get().currentPage
		const totalPages = Math.ceil(visible.length / ITEMS_PER_PAGE)
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
		const endIndex = startIndex + ITEMS_PER_PAGE
		const items = visible.slice(startIndex, endIndex)

		return {
			items,
			totalPages,
			currentPage,
		}
	},
}))
