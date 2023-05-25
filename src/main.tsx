import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './routes/App'

import About from './routes/About'
import './styles/global.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/about',
        element: <About />,
    },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router} />
)
