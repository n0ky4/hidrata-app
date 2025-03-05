import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LocaleProvider } from './i18n/context/LocaleProvider.tsx'
import App from './pages/App.tsx'
import SetupPage from './pages/Setup.tsx'
import './styles/global.css'

const router = (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/setup' element={<SetupPage />} />
        </Routes>
    </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(<LocaleProvider>{router}</LocaleProvider>)
