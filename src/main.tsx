import React from 'react'
import { createRoot } from 'react-dom/client'
import {
	createBrowserRouter,
	createHashRouter,
	Navigate,
	RouterProvider,
} from 'react-router-dom'
import App from './App'
import './index.css'
import CreateProductPage from './pages/CreateProductPage'
import EditProductPage from './pages/EditProductPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ProductsPage from './pages/ProductsPage'

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
const router = (import.meta as unknown as { env: { [key: string]: any } }).env
	.PROD
	? createHashRouter([routerConfig])
	: createBrowserRouter([routerConfig])

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
