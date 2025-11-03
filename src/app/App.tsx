import { FC } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export const App: FC = () => {
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
