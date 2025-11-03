import CreateProductPage from '@/pages/CreateProductPage'
import EditProductPage from '@/pages/EditProductPage'
import ProductDetailsPage from '@/pages/ProductDetailsPage'
import ProductsPage from '@/pages/ProductsPage'
import {
	createBrowserRouter,
	createHashRouter,
	Navigate,
} from 'react-router-dom'
import { App } from './App'

const routerConfig = {
	path: '/',
	element: <App />,
	children: [
		{ index: true, element: <Navigate to='/products' replace /> },
		{ path: '/products', element: <ProductsPage /> },
		{ path: '/products/:id', element: <ProductDetailsPage /> },
		{ path: '/create-product', element: <CreateProductPage /> },
		{ path: '/edit-product/:id', element: <EditProductPage /> },
	],
}

// Используем HashRouter для GitHub Pages, BrowserRouter для разработки
export const router = (
	import.meta as unknown as { env: { [key: string]: any } }
).env.PROD
	? createHashRouter([routerConfig])
	: createBrowserRouter([routerConfig])
