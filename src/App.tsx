import { useEffect, useState } from 'react'
import { FirstUseScreen } from './components/FirstUseScreen'
import { useInitHandler } from './core/initHandler'

function App() {
    const [mounted, setMounted] = useState(false)
    const [firstRun, setFirstRun] = useState(false)
    const { check } = useInitHandler(setFirstRun)

    useEffect(() => {
        check()
        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!mounted) return null

    if (firstRun) {
        return <FirstUseScreen show={firstRun} onClose={() => setFirstRun(false)} />
    }

    return (
        <main>
            <h1>hidrata-app 2.0</h1>
            <p>Essa é a nova versão do hidrata-app.</p>
        </main>
    )
}

export default App
