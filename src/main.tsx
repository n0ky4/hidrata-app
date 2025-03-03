import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LocaleProvider } from './i18n/context/LocaleProvider.tsx'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
    <LocaleProvider>
        <App />
    </LocaleProvider>
)
