import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
	return (
		<div className='app'>
			<header className='header'>
				<nav className='nav'>
					<NavLink
						to='/products'
						className={({ isActive }) => (isActive ? 'link active' : 'link')}
					>
						Продукты
					</NavLink>
					<NavLink
						to='/create-product'
						className={({ isActive }) => (isActive ? 'link active' : 'link')}
					>
						Создать продукт
					</NavLink>
				</nav>
			</header>
			<main className='main'>
				<Outlet />
			</main>
		</div>
	)
}
