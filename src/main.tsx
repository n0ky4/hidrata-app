import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import About from './routes/About'
import App from './routes/App'
import Error404 from './routes/Error404'

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
    {
        path: '*',
        element: <Error404 />,
    },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router} />
)
